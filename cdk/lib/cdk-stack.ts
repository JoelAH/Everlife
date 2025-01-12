import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as fs from 'fs';
import { createGameStateTable } from './game-state';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table for game state
    const gameStateTable = createGameStateTable(this);

    /** COGNITO */
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

    /** SSM */
    // Create SSM Parameters for game data
    const enemiesJson = fs.readFileSync(join(__dirname, '../lib/states/enemies.json'), 'utf-8');
    const powersJson = fs.readFileSync(join(__dirname, '../lib/states/powers.json'), 'utf-8');

    if (enemiesJson) {
      const enemiesObj = JSON.parse(enemiesJson);
      const fire = JSON.stringify(enemiesObj.filter((e: any) => e.type === 'fire'));
      const pollution = JSON.stringify(enemiesObj.filter((e: any) => e.type === 'pollution'));
      const corruption = JSON.stringify(enemiesObj.filter((e: any) => e.type === 'corruption'));
      const machine = JSON.stringify(enemiesObj.filter((e: any) => e.type === 'machine'));

      new ssm.StringParameter(this, 'EnemiesParameterFire', {
        parameterName: '/everlife/enemies/fire',
        stringValue: fire,
      });
      new ssm.StringParameter(this, 'EnemiesParameterPollution', {
        parameterName: '/everlife/enemies/pollution',
        stringValue: pollution,
      });
      new ssm.StringParameter(this, 'EnemiesParameterCorruption', {
        parameterName: '/everlife/enemies/corruption',
        stringValue: corruption,
      });
      new ssm.StringParameter(this, 'EnemiesParameterMachine', {
        parameterName: '/everlife/enemies/machine',
        stringValue: machine,
      });
    }

    if (powersJson) {
      new ssm.StringParameter(this, 'PowersParameter', {
        parameterName: '/everlife/powers',
        stringValue: powersJson,
      });
    }

    /** LAMBDA */
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

    // Create States Lambda function
    const statesFunction = new NodejsFunction(this, 'StatesFunction', {
      entry: join(__dirname, '../lambda/states.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
    });

    // Grant SSM read permissions to States Lambda
    statesFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ssm:GetParameters'],
        resources: [
          `arn:aws:ssm:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:parameter/everlife/*`
        ],
      })
    );
    // Grant DynamoDB read permissions
    gameStateTable.grantReadData(statesFunction);

    /** API GATEWAY */
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

    // Create API Gateway endpoints
    const states = api.root.addResource('states');
    states.addMethod('GET', new apigateway.LambdaIntegration(statesFunction));

    // Create login endpoint
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
