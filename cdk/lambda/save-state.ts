import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { CognitoJwtVerifier } from "aws-jwt-verify";

const dynamoClient = new DynamoDBClient({});

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        // Verify the token
        if (!event.headers.Authorization) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'No authorization token provided' })
            };
        }

        const token = event.headers.Authorization.replace('Bearer ', '');

        // Note: Replace these with your actual Cognito pool details from the CDK stack
        const verifier = CognitoJwtVerifier.create({
            userPoolId: process.env.USER_POOL_ID!,
            tokenUse: "id",
            clientId: process.env.CLIENT_ID!
        });

        const payload = await verifier.verify(token);
        const subId = payload.sub;

        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'No game state data provided' })
            };
        }

        const gameState = JSON.parse(event.body);

        // Save to DynamoDB
        const putCommand = new PutItemCommand({
            TableName: process.env.TABLE_NAME,
            Item: {
                userId: { S: subId },
                gameState: { S: JSON.stringify(gameState) },
                timestamp: { N: Date.now().toString() }
            }
        });

        await dynamoClient.send(putCommand);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // CORS header
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Game state saved successfully' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // CORS header
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
}