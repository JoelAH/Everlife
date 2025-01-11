import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';
import { GAME_STATES } from './gameStates';

const ssmClient = new SSMClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const parameterNames = [
            '/everlife/enemies/fire',
            '/everlife/enemies/corruption',
            '/everlife/enemies/pollution',
            '/everlife/enemies/machine',
            '/everlife/powers'
        ];

        const command = new GetParametersCommand({
            Names: parameterNames,
            WithDecryption: false
        });

        const response = await ssmClient.send(command);

        if (!response.Parameters || response.Parameters.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Game state parameters not found' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            };
        }

        const gameState = {
            enemies: [
                ...JSON.parse(response.Parameters.find((p: any) => p.Name === '/everlife/enemies/fire')?.Value || '{}'),
                ...JSON.parse(response.Parameters.find((p: any) => p.Name === '/everlife/enemies/pollution')?.Value || '{}'),
                ...JSON.parse(response.Parameters.find((p: any) => p.Name === '/everlife/enemies/corruption')?.Value || '{}'),
                ...JSON.parse(response.Parameters.find((p: any) => p.Name === '/everlife/enemies/machine')?.Value || '{}')
            ],
            powers: JSON.parse(response.Parameters.find((p: any) => p.Name === '/everlife/powers')?.Value || '{}'),
            state: GAME_STATES
        };

        return {
            statusCode: 200,
            body: JSON.stringify(gameState),
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