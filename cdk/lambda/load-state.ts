import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import * as fs from 'fs';
import * as path from 'path';

const dynamoClient = new DynamoDBClient({});

async function loadGameState() {
    // Read the state.json file
    const stateData = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/state.json'), 'utf-8'));

    // Prepare items for batch write
    const putRequests = stateData.map((state: any) => ({
        PutRequest: {
            Item: {
                step: { N: state.step.toString() },
                choice: { N: (state.choice || 0).toString() },
                mode: { S: state.mode },
                messages: { S: JSON.stringify(state.messages) },
                currentLocation: { S: state.currentLocation },
                options: state.options ? { S: JSON.stringify(state.options) } : { NULL: true },
                currentEnemyType: state.currentEnemyType ? { S: state.currentEnemyType } : { NULL: true }
            }
        }
    }));

    // Split into chunks of 25 (DynamoDB batch write limit)
    const chunks = [];
    for (let i = 0; i < putRequests.length; i += 25) {
        chunks.push(putRequests.slice(i, i + 25));
    }

    // Process each chunk
    for (const chunk of chunks) {
        const command = new BatchWriteItemCommand({
            RequestItems: {
                'gamestate': chunk
            }
        });

        await dynamoClient.send(command);
    }
}

// Execute when the module is run directly
if (require.main === module) {
    loadGameState().catch(console.error);
}