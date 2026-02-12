import json
import boto3
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
rekognition = boto3.client("rekognition")

USERS_TABLE = "Users"
COLLECTION_ID = "smart-attendance-collection"

table = dynamodb.Table(USERS_TABLE)

def lambda_handler(event, context):
    try:
        method = event["requestContext"]["http"]["method"]

        # ===== CORS =====
        if method == "OPTIONS":
            return response(200, {})

        # ===== GET USERS =====
        if method == "GET":
            res = table.scan()
            return response(200, res.get("Items", []))

        body = json.loads(event["body"]) if event.get("body") else {}

        # ===== UPDATE USER =====
        if method == "PUT":
            email = body.get("email")
            name = body.get("name")
            role = body.get("role")
            registerNumber = body.get("registerNumber", "")

            if not email or not name or not role:
                return response(400, {"message": "Missing required fields"})

            # Prevent removing Admin role accidentally
            old_user = table.get_item(Key={"email": email}).get("Item")
            if not old_user:
                return response(404, {"message": "User not found"})

            if old_user["role"] == "Admin" and role != "Admin":
                return response(403, {"message": "Admin role cannot be changed"})

            update_exp = "SET #n=:n, #r=:r, registerNumber=:reg, updatedAt=:u"
            table.update_item(
                Key={"email": email},
                UpdateExpression=update_exp,
                ExpressionAttributeNames={
                    "#n": "name",
                    "#r": "role"
                },
                ExpressionAttributeValues={
                    ":n": name,
                    ":r": role,
                    ":reg": registerNumber,
                    ":u": datetime.utcnow().isoformat()
                }
            )

            return response(200, {"message": "User updated successfully"})

        # ===== DELETE USER =====
        if method == "DELETE":
            email = event["queryStringParameters"]["email"]

            user = table.get_item(Key={"email": email}).get("Item")
            if not user:
                return response(404, {"message": "User not found"})

            # 🔒 Prevent Admin deletion
            if user["role"] == "Admin":
                return response(403, {"message": "Admin cannot be deleted"})

            # Remove face from Rekognition
            if user.get("faceId"):
                rekognition.delete_faces(
                    CollectionId=COLLECTION_ID,
                    FaceIds=[user["faceId"]]
                )

            table.delete_item(Key={"email": email})
            return response(200, {"message": "User deleted successfully"})

        return response(405, {"message": "Method not allowed"})

    except Exception as e:
        return response(500, {"error": str(e)})

def response(code, body):
    return {
        "statusCode": code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
        },
        "body": json.dumps(body)
    }
