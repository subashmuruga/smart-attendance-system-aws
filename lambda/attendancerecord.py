import json
import boto3

dynamodb = boto3.resource('dynamodb')

USERS_TABLE = "Users"
ATTENDANCE_TABLE = "Attendance"

users_table = dynamodb.Table(USERS_TABLE)
attendance_table = dynamodb.Table(ATTENDANCE_TABLE)

def lambda_handler(event, context):
    try:
        # Handle preflight (CORS)
        if event.get("httpMethod") == "OPTIONS":
            return cors_response(200, [])

        params = event.get('queryStringParameters') or {}
        date = params.get('date')

        if not date:
            return cors_response(400, {"message": "Date is required"})

        users = users_table.scan().get('Items', [])
        records = []

        for user in users:
            email = user['email']
            name = user.get('name', '')
            role = user.get('role', '')
            regno = user.get('registerNumber', '-')

            att = attendance_table.get_item(
                Key={
                    'email': email,
                    'date': date
                }
            )

            if 'Item' in att:
                status = "PRESENT"
                time = att['Item'].get('time', '-')
            else:
                status = "ABSENT"
                time = "-"

            records.append({
                "name": name,
                "role": role,
                "registerNumber": regno,
                "date": date,
                "time": time,
                "status": status
            })

        return cors_response(200, records)

    except Exception as e:
        return cors_response(500, {"message": str(e)})


def cors_response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        "body": json.dumps(body)
    }
