import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as fs from 'fs';
import { createGameStateTable, createSavedStateTable } from './game-state';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket for website hosting
    const websiteBucket = new s3.Bucket(this, 'everlife-bucket', {
      bucketName: 'everlife-frontend',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // Block all public access
      publicReadAccess: false, // Keep bucket private
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production
    });

    // Create Origin Access Control
    const oac = new cloudfront.CfnOriginAccessControl(this, 'OAC', {
      originAccessControlConfig: {
        name: 'OAC for website',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4'
      }
    });

    // Create CloudFront distribution with OAC
    const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity: undefined // Disable OAI
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.S3OriginConfig.OriginAccessIdentity',
      ''
    );
    // Connect the OAC to the CloudFront distribution
    cfnDistribution.addPropertyOverride(
      'DistributionConfig.Origins.0.OriginAccessControlId',
      oac.getAtt('Id')
    );


    // Add S3 bucket policy to allow access from CloudFront
    websiteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [websiteBucket.arnForObjects('*')],
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
      conditions: {
        StringEquals: {
          'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`
        }
      }
    }));

    // Deploy website content to S3
    new s3deploy.BucketDeployment(this, 'everlife-deploy', {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: websiteBucket,
      distribution: distribution, // Add this to invalidate CloudFront cache after deployment
      distributionPaths: ['/*'],
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'Website URL',
    });

    // Create DynamoDB table for game state
    const gameStateTable = createGameStateTable(this);
    const savedStateTable = createSavedStateTable(this);

    /** COGNITO */
    // Create Cognito User Pool
    const userPool = new cognito.UserPool(this, 'EverPool', {
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
        adminUserPassword: true,
        userPassword: true,
        custom: true,
        userSrp: true,
      },
      refreshTokenValidity: cdk.Duration.days(30),
      accessTokenValidity: cdk.Duration.minutes(60),
      idTokenValidity: cdk.Duration.minutes(60),
    });

    // Create Lambda function for token refresh
    const refreshTokenFunction = new NodejsFunction(this, 'RefreshTokenFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: join(__dirname, '../lambda/refresh-token.ts'),
      environment: {
        CLIENT_ID: client.userPoolClientId,
      },
    });

    // Grant Cognito permissions to the refresh token Lambda
    refreshTokenFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito-idp:InitiateAuth'],
      resources: [userPool.userPoolArn],
    }));

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

    // Create get-state Lambda function
    const getStateFunction = new NodejsFunction(this, 'GetStateFunction', {
      entry: join(__dirname, '../lambda/get-state.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        SAVED_STATE_TABLE_NAME: savedStateTable.tableName,
      },
    });

    // Grant DynamoDB read permissions to get-state Lambda
    savedStateTable.grantReadData(getStateFunction);

    // Create save-state Lambda function
    const saveStateFunction = new NodejsFunction(this, 'SaveStateFunction', {
      entry: join(__dirname, '../lambda/save-state.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        USER_POOL_ID: userPool.userPoolId,
        CLIENT_ID: client.userPoolClientId,
        TABLE_NAME: savedStateTable.tableName,
      },
    });

    // Grant DynamoDB write permissions
    savedStateTable.grantWriteData(saveStateFunction);

    /** API GATEWAY */
    // Create API Gateway
    const api = new apigateway.RestApi(this, 'EverlifeApi', {
      restApiName: 'Everlife Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS, // Allow all origins
        allowMethods: apigateway.Cors.ALL_METHODS, // Allow all HTTP methods
        allowHeaders: ['Authorization', 'Content-Type'],
      }
    });

    // Add refresh token endpoint
    const refreshTokenIntegration = new apigateway.LambdaIntegration(refreshTokenFunction);
    api.root.addResource('refresh-token').addMethod('POST', refreshTokenIntegration);

    // Create Cognito Authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'CognitoAuthorizer', {
      cognitoUserPools: [userPool],
    });

    // GET /get-state endpoint
    api.root.addResource('get-state')
      .addMethod('GET', new apigateway.LambdaIntegration(getStateFunction), {
        authorizer: authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
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

    const saveStateModel = api.addModel('SaveStateRequestModel', {
      contentType: 'application/json',
      modelName: 'SaveStateRequestModel',
      schema: {
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          step: { type: apigateway.JsonSchemaType.NUMBER },
          mode: { type: apigateway.JsonSchemaType.STRING },
          messages: { type: apigateway.JsonSchemaType.ARRAY },
          currentLocation: { type: apigateway.JsonSchemaType.STRING },
          playerStats: { type: apigateway.JsonSchemaType.OBJECT },
          inventory: { type: apigateway.JsonSchemaType.ARRAY },
          elementalPowers: { type: apigateway.JsonSchemaType.ARRAY },
          environmentStatus: { type: apigateway.JsonSchemaType.NUMBER },
          currentEnemy: { type: apigateway.JsonSchemaType.OBJECT }
        },
        required: ['step', 'mode', 'playerStats'], // Ensure both fields are required
      },
    });

    // Create API Gateway endpoints
    const states = api.root.addResource('states');
    states.addMethod('GET', new apigateway.LambdaIntegration(statesFunction));

    // Create login endpoint
    // Add request validator
    const validator = new apigateway.RequestValidator(this, 'RequestValidator', {
      restApi: api,
      validateRequestBody: true,
    });
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

    // Add save-state endpoint
    const savedStateValidator = new apigateway.RequestValidator(this, 'SavedStateValidator', {
      restApi: api,
      requestValidatorName: 'SavedStateBodyValidator',
      validateRequestBody: true,
    });
    const saveState = api.root.addResource('save-state');
    saveState.addMethod('POST',
      new apigateway.LambdaIntegration(saveStateFunction, {
        proxy: true
      }),
      {
        authorizer: authorizer,
        authorizationType: apigateway.AuthorizationType.COGNITO,
        requestValidator: savedStateValidator,
        requestModels: {
          'application/json': saveStateModel,
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
      });

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}
