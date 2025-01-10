import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Cognito User Pool
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'everlife-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
    });

    // Create Cognito Client
    const client = userPool.addClient('everlife-client', {
      authFlows: {
        userPassword: true,
      },
    });

    // Create Lambda function
    const loginFunction = new NodejsFunction(this, 'LoginFunction', {
      entry: join(__dirname, '../lambda/login.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        USER_POOL_ID: userPool.userPoolId,
        CLIENT_ID: client.userPoolClientId,
      },
    });

    // Grant Cognito permissions to Lambda
    loginFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['cognito-idp:SignUp', 'cognito-idp:InitiateAuth'],
        resources: [userPool.userPoolArn],
      })
    );

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'LoginApi', {
      restApiName: 'Login Service',
    });

    // Create API Gateway endpoint
    const login = api.root.addResource('login');
    login.addMethod(
      'POST',
      new apigateway.LambdaIntegration(loginFunction, {
        proxy: true,
      })
    );

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}
