import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({});

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Request body is required' })
            };
        }

        const { refreshToken } = JSON.parse(event.body);
        
        if (!refreshToken) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Refresh token is required' })
            };
        }

        const command = new InitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: process.env.CLIENT_ID!,
            AuthParameters: {
                'REFRESH_TOKEN': refreshToken
            }
        });

        const response = await cognitoClient.send(command);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                accessToken: response.AuthenticationResult?.AccessToken,
                token: response.AuthenticationResult?.IdToken,
                refreshToken: response.AuthenticationResult?.RefreshToken || refreshToken
            })
        };
    } catch (error) {
        console.error('Error refreshing token:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error refreshing token' })
        };
    }
}