import json
import base64
import boto3
import uuid

s3 = boto3.client("s3")

BUCKET_NAME = "smart-attendance-profile-images"

def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    }

def lambda_handler(event, context):

    # 🔹 Handle CORS preflight
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": ""
        }

    try:
        body = json.loads(event["body"])
        user_id = body["userId"]
        image_base64 = body["image"]

        # Remove base64 header
        image_data = base64.b64decode(image_base64.split(",")[1])

        file_name = f"profile-images/{user_id}-{uuid.uuid4()}.jpg"

        # Upload to S3
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=file_name,
            Body=image_data,
            ContentType="image/jpeg"
        )

        image_url = f"https://{BUCKET_NAME}.s3.ap-south-1.amazonaws.com/{file_name}"

        return {
            "statusCode": 200,
            "headers": cors_headers(),
            "body": json.dumps({
                "imageUrl": image_url
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": cors_headers(),
            "body": json.dumps({
                "error": str(e)
            })
        }
