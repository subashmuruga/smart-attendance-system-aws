import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table("Users")

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))

        email = body.get('email', '').strip()
        password = body.get('password', '').strip()

        if not email or not password:
            return response_json(400, "Email and password are required")

        # 1️⃣ Get user
        response = table.get_item(Key={'email': email})

        if 'Item' not in response:
            return response_json(400, "User not registered. Please register.")

        user = response['Item']

        # 2️⃣ Password check (plain for now)
        if password != user.get('passwordHash'):
            return response_json(401, "Invalid credentials")

        # 3️⃣ Login success
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "POST"
            },
            "body": json.dumps({
                "message": "Login successful",
                "role": user.get('role'),
                "email": user.get('email'),
                "name": user.get('name')
            })
        }

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
