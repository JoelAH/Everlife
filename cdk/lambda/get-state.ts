import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.SAVED_STATE_TABLE_NAME || '';

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // Get the Cognito user ID (sub) from the authorizer context
    const cognitoSub = event.requestContext.authorizer?.claims.sub;
    
    if (!cognitoSub) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized - Missing user ID' })
        };
    }

    try {
        // Query DynamoDB for the saved state using the Cognito sub as the key
        const params = {
            TableName: TABLE_NAME,
            Key: {
                userId: cognitoSub
            }
        };

        const result = await dynamoDB.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No saved state found for user' })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(result.Item.gameState)
        };
    } catch (error) {
        console.error('Error retrieving state:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error retrieving state' })
        };
    }
}