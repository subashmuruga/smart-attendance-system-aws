import json
import boto3
import base64
from datetime import datetime

rekognition = boto3.client("rekognition")
dynamodb = boto3.resource("dynamodb")
ses = boto3.client("ses")

USERS_TABLE = "Users"
ATTENDANCE_TABLE = "Attendance"
COLLECTION_ID = "smart-attendance-collection"
SENDER_EMAIL = "subashm012001@gmail.com"

users_table = dynamodb.Table(USERS_TABLE)
attendance_table = dynamodb.Table(ATTENDANCE_TABLE)


def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])

        # 🔐 PAGE ROLE (FROM FRONTEND)
        page_role = body.get("pageRole")
        if not page_role:
            return response(400, "Page role missing")

        image_base64 = body["faceImage"]
        image_bytes = base64.b64decode(image_base64.split(",")[1])

        # 🔍 FACE SEARCH
        search = rekognition.search_faces_by_image(
            CollectionId=COLLECTION_ID,
            Image={"Bytes": image_bytes},
            FaceMatchThreshold=90,
            MaxFaces=1
        )

        if not search["FaceMatches"]:
            return response(400, "Face not recognized")

        face_id = search["FaceMatches"][0]["Face"]["FaceId"]

        # 🔍 FIND USER
        user = None
        scan = users_table.scan()
        for item in scan["Items"]:
            if item.get("faceId") == face_id:
                user = item
                break

        if not user:
            return response(400, "User not found")

        # 👤 USER DETAILS
        email = user["email"]
        name = user["name"]
        actual_role = user["role"]
        regno = user.get("registerNumber", "")

        # 🔐 ROLE VALIDATION (IMPORTANT)
        if actual_role != page_role:
            return response(
                403,
                f"Access denied: {actual_role} cannot mark attendance from {page_role} page"
            )

        today = datetime.utcnow().strftime("%Y-%m-%d")
        time_now = datetime.utcnow().strftime("%H:%M:%S")

        # 🚫 DUPLICATE CHECK
        existing = attendance_table.get_item(
            Key={"email": email, "date": today}
        )

        if "Item" in existing:
            return response(400, "Attendance already marked today")

        # ✅ SAVE ATTENDANCE
        attendance_table.put_item(
            Item={
                "email": email,
                "date": today,
                "name": name,
                "role": actual_role,
                "registerNumber": regno,
                "time": time_now,
                "status": "PRESENT"
            }
        )

        # 📧 EMAIL (NON-BLOCKING)
        try:
            ses.send_email(
                Source=SENDER_EMAIL,
                Destination={"ToAddresses": [email]},
                Message={
                    "Subject": {"Data": "Attendance Marked Successfully"},
                    "Body": {
                        "Text": {
                            "Data": f"""
Hello {name},

Your attendance has been marked successfully.

Date   : {today}
Time   : {time_now}
Role   : {actual_role}
Status : PRESENT

Smart Attendance System
"""
                        }
                    }
                }
            )
        except Exception:
            pass

        return response(200, "Attendance marked successfully")

    except Exception as e:
        return response(500, str(e))


def response(status, message):
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "POST"
        },
        "body": json.dumps({"message": message})
    }
