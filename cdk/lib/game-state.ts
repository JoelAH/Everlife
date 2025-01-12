import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

export function createGameStateTable(stack: any) {
  // Create DynamoDB table for game state
  const gameStateTable = new dynamodb.Table(stack, 'GameStateTable', {
    tableName: 'gamestate',
    partitionKey: { name: 'step', type: dynamodb.AttributeType.NUMBER },
    sortKey: { name: 'choice', type: dynamodb.AttributeType.NUMBER },
    removalPolicy: RemovalPolicy.DESTROY, // For development - change for production
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  return gameStateTable;
}