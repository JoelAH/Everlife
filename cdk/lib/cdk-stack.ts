import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as fs from 'fs';

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
        minLength: 6
      },
      autoVerify: { email: true }, // Automatically verify the email
      userVerification: {
        emailStyle: undefined // No email verification required
      },
    });

    // Create Cognito Client
    const client = userPool.addClient('everlife-client', {
      authFlows: {
        userPassword: true,
      },
    });

    // Create SSM Parameters for game data
    const enemiesJson = fs.readFileSync(join(__dirname, '../states/enemies.json'), 'utf-8');
    const powersJson = fs.readFileSync(join(__dirname, '../states/powers.json'), 'utf-8');
    const gameStateJson = fs.readFileSync(join(__dirname, '../states/state.json'), 'utf-8');

    new ssm.StringParameter(this, 'EnemiesParameter', {
      parameterName: '/everlife/enemies',
      stringValue: enemiesJson,
    });

    new ssm.StringParameter(this, 'PowersParameter', {
      parameterName: '/everlife/powers',
      stringValue: powersJson,
    });

    new ssm.StringParameter(this, 'GameStateParameter', {
      parameterName: '/everlife/gamestate',
      stringValue: gameStateJson,
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
        actions: ['cognito-idp:SignUp', 'cognito-idp:InitiateAuth', 'cognito-idp:AdminConfirmSignUp'],
        resources: [userPool.userPoolArn],
      })
    );

    // Grant Lambda permissions to read SSM parameters
    // loginFunction.addToRolePolicy(
    //   new iam.PolicyStatement({
    //     actions: ['ssm:GetParameter'],
    //     resources: [
    //       `arn:aws:ssm:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:parameter/everlife/*`
    //     ],
    //   })
    // );

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'EverlifeApi', {
      restApiName: 'Everlife Service',
      deploy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS, // Allow all origins
        allowMethods: apigateway.Cors.ALL_METHODS, // Allow all HTTP methods
        allowHeaders: ['Authorization', 'Content-Type'],
      }
    });

    const deployment = new apigateway.Deployment(this, 'ApiDeployment', {
      api,
    });

    api.deploymentStage = new apigateway.Stage(this, 'ProdStage', {
      deployment,
      stageName: 'prod',
    });

    // Create a Request Model for validation
    const requestModel = api.addModel('LoginRequestModel', {
      contentType: 'application/json',
      modelName: 'LoginRequestModel',
      schema: {
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          email: { type: apigateway.JsonSchemaType.STRING },
          password: { type: apigateway.JsonSchemaType.STRING },
        },
        required: ['email', 'password'], // Ensure both fields are required
      },
    });

    // Add request validator
    const validator = new apigateway.RequestValidator(this, 'RequestValidator', {
      restApi: api,
      validateRequestBody: true,
    });

    // Create API Gateway endpoint
    const login = api.root.addResource('login');
    login.addMethod(
      'POST',
      new apigateway.LambdaIntegration(loginFunction, {
        proxy: true
      }),
      {
        requestValidator: validator,
        requestModels: {
          'application/json': requestModel,
        },
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Headers': true,
            },
          },
        ]
      }
    );

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}
