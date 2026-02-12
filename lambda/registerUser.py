import json
import boto3
import base64
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
rekognition = boto3.client('rekognition')
s3 = boto3.client('s3')
ses = boto3.client('ses')

USERS_TABLE = "Users"
FACE_BUCKET = "smart-attendance-face-images"
COLLECTION_ID = "smart-attendance-collection"
SENDER_EMAIL = "subashm012001@gmail.com"

table = dynamodb.Table(USERS_TABLE)

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))

        # ✅ BASIC VALIDATION (VERY IMPORTANT)
        email = body.get('email', '').strip()
        name = body.get('name', '').strip()
        password = body.get('password', '')
        role = body.get('role', '')
        reg_no = body.get('regNo', '')
        image_base64 = body.get('faceImage', '')

        if not email or not name or not password or not role or not image_base64:
            return response_json(400, "Invalid request data")

        # 1️⃣ Check email already exists
        existing = table.get_item(Key={'email': email})
        if 'Item' in existing:
            return response_json(400, "You are already registered. Please login.")

        # 2️⃣ Decode image
        image_bytes = base64.b64decode(image_base64.split(',')[1])
        image_key = f"faces/{uuid.uuid4()}.png"

        # 3️⃣ Upload image to S3
        s3.put_object(
            Bucket=FACE_BUCKET,
            Key=image_key,
            Body=image_bytes,
            ContentType='image/png'
        )

        # 4️⃣ Check face already exists
        search = rekognition.search_faces_by_image(
            CollectionId=COLLECTION_ID,
            Image={'S3Object': {'Bucket': FACE_BUCKET, 'Name': image_key}},
            FaceMatchThreshold=90,
            MaxFaces=1
        )

        if search.get('FaceMatches'):
            return response_json(400, "Face already registered. Please login.")

        # 5️⃣ Index face
        index = rekognition.index_faces(
            CollectionId=COLLECTION_ID,
            Image={'S3Object': {'Bucket': FACE_BUCKET, 'Name': image_key}},
            DetectionAttributes=[]
        )

        face_id = index['FaceRecords'][0]['Face']['FaceId']

        # 6️⃣ Save user to DynamoDB
        table.put_item(
            Item={
                'email': email,
                'userId': str(uuid.uuid4()),
                'name': name,
                'role': role,
                'registerNumber': reg_no,
                'passwordHash': password,  # later hash
                'faceId': face_id,
                'imageUrl': image_key,
                'createdAt': datetime.utcnow().isoformat()
            }
        )

        # 7️⃣ Send email (ONLY if SES allows)
        try:
            ses.send_email(
                Source=SENDER_EMAIL,
                Destination={'ToAddresses': [email]},
                Message={
                    'Subject': {'Data': 'Registration Successful'},
                    'Body': {
                        'Text': {
                            'Data': f"""
Hello {name},

You have successfully registered in the Smart Attendance System.

Role : {role}

You can now login and mark your attendance.

Smart Attendance System
"""
                        }
                    }
                }
            )
        except Exception as e:
            print("Email skipped:", str(e))

        return response_json(200, "Registration successful")

    except Exception as e:
        return response_json(500, str(e))


def response_json(status, message):
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "POST"
        },
        "body": json.dumps({"message": message})
    }
