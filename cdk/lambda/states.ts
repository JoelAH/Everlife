import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const ssmClient = new SSMClient();
const dynamoClient = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Get SSM Parameters
        const parameterNames = [
            '/everlife/enemies/fire',
            '/everlife/enemies/corruption',
            '/everlife/enemies/pollution',
            '/everlife/enemies/machine',
            '/everlife/powers'
        ];

        const ssmCommand = new GetParametersCommand({
            Names: parameterNames,
            WithDecryption: false
        });

        const ssmResponse = await ssmClient.send(ssmCommand);

        // Get DynamoDB Game States
        const dynamoCommand = new ScanCommand({
            TableName: 'gamestate',
        });

        const dynamoResponse = await dynamoClient.send(dynamoCommand);

        if (!ssmResponse.Parameters || ssmResponse.Parameters.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Game state parameters not found' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            };
        }

        // Convert DynamoDB items to regular JavaScript objects
        const gameStates = dynamoResponse.Items ? 
            dynamoResponse.Items.map(item => unmarshall(item)) : [];

        // Create response with both SSM parameters and DynamoDB game states
        const response = {
            gameStates: gameStates.sort((a, b) => a.step - b.step),
            enemies: [
                ...JSON.parse(ssmResponse.Parameters.find((p: any) => p.Name === '/everlife/enemies/fire')?.Value || '{}'),
                ...JSON.parse(ssmResponse.Parameters.find((p: any) => p.Name === '/everlife/enemies/pollution')?.Value || '{}'),
                ...JSON.parse(ssmResponse.Parameters.find((p: any) => p.Name === '/everlife/enemies/corruption')?.Value || '{}'),
                ...JSON.parse(ssmResponse.Parameters.find((p: any) => p.Name === '/everlife/enemies/machine')?.Value || '{}')
            ],
            powers: JSON.parse(ssmResponse.Parameters.find((p: any) => p.Name === '/everlife/powers')?.Value || '{}')
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    } catch (error) {
        console.error('Error fetching game state:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    }
};