const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const apigw = require("@aws-cdk/aws-apigateway");
const path = require('path');

class CdkToolStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // All constructs take these same three arguments : scope, id/name, props
    const lambdaTelegram = new lambda.Function(this, "telegramBotHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, '../../assets/lambda/telegram-bot')), // Get relevant path to lambda directory.
      architecture: lambda.Architecture.ARM_64,
      environment: {
        'CURRENT_ENV': 'dev',
      },
      description: `Generated on: ${new Date().toISOString()}`  // added to keep pushing latest code on AWS lambda on each deployment.
    });

    /*Versioning every new changes and keeping track of it. Check AWS Lambda UI Console*/
    const version = new lambda.Version(this, 'Ver'+new Date().toISOString(), {
      lambda: lambdaTelegram,
    });

    // All constructs take these same three arguments : scope, id/name, props
    // defines an API Gateway REST API resource backed by our "telegrambot-api" function.
    const restApi = new apigw.RestApi(this, "telegrambot-api", { 
        deploy: false,
        defaultCorsPreflightOptions: { // Enable CORS policy to allow from any origin. Customize as needed.
          allowHeaders: [
            'Content-Type',
            'X-Amz-Date',
            'Authorization',
            'X-Api-Key',
          ],
          allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          allowCredentials: false,
          allowOrigins: apigw.Cors.ALL_ORIGINS,
        }
    });

    // Let's keep this as it as and use it for normal 'Hello World' Response with GET method integration with lamhda.
    restApi.root
      .addResource("bot")
      .addMethod("GET", new apigw.LambdaIntegration(lambdaTelegram, { proxy: true }));

    // Lets add nested resource under /bot resource path and attach a POST method with same Lambda integration.
    restApi.root
      .getResource("bot")
      .addResource("webhook")
      .addMethod("POST", new apigw.LambdaIntegration(lambdaTelegram, { proxy: true }));

    // All constructs take these same three arguments : scope, id/name, props
    const devDeploy = new apigw.Deployment(this, "dev-deployment", { api: restApi });

    // All constructs take these same three arguments : scope, id/name, props
    const devStage = new apigw.Stage(this, "devStage", {
      deployment: devDeploy,
      stageName: 'dev' // If not passed, by default it will be 'prod'
    });

    // All constructs take these same three arguments : scope, id/name, props
    new cdk.CfnOutput(this, "BotURL", {
      value: `https://${restApi.restApiId}.execute-api.${this.region}.amazonaws.com/dev/bot`,
    });

    new cdk.CfnOutput(this, "BotWebhookUrl", {
      value: `https://${restApi.restApiId}.execute-api.${this.region}.amazonaws.com/dev/bot/webhook`,
    });

    new cdk.CfnOutput(this, "Lambda Cloudwatch Log URL", {
      value: `https://console.aws.amazon.com/cloudwatch/home?region=${this.region}#logsV2:log-groups/log-group/$252Faws$252Flambda$252F${lambdaTelegram.functionName}`
    });
  }
}

module.exports = { CdkToolStack };

/**
 * 
 * https://core.telegram.org/bots/api#setwebhook


https://api.telegram.org/bot5118686429:AAHtgBvYLyrTSIUJ-iNRmV5MiuTYcSfAXIY/setWebhook?url=https://389bvh5afg.execute-api.us-east-1.amazonaws.com/dev/bot/webhook
https://api.telegram.org/bot{bot_token}/getWebhookInfo?url={url_to_send_updates_to}
https://api.telegram.org/bot{bot_token}/WebhookInfo?url={url_to_send_updates_to}
https://api.telegram.org/bot{bot_token}/deleteWebhook?url={url_to_send_updates_to}



const restApi = new apigw.RestApi(this, `api`, {
  defaultCorsPreflightOptions: {
    allowOrigins: apigw.Cors.ALL_ORIGINS
  }
});


bot_token=5118686429:AAHtgBvYLyrTSIUJ-iNRmV5MiuTYcSfAXIY
url_to_send_updates_to=https://389bvh5afg.execute-api.us-east-1.amazonaws.com/dev/bot/webhook

npm install @aws-cdk/core@1.137
npm install -g aws-cdk






2022-02-20T07:02:07.160Z	02092cba-e7ad-4c27-bb01-123613b93321	INFO	request: {
    "resource": "/bot/webhook",
    "path": "/bot/webhook",
    "httpMethod": "POST",
    "headers": {
        "Accept-Encoding": "gzip, deflate",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "NL",
        "Content-Type": "application/json",
        "Host": "tq9rr56bhc.execute-api.us-east-1.amazonaws.com",
        "User-Agent": "Amazon CloudFront",
        "Via": "1.1 9c100894a6989e860712c14c4867bd0a.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "z-2Sk7Y6wfk5YnDwGbCJm9kqjcXAR-LyxSD_yH7_n469YUVXo5oxLg==",
        "X-Amzn-Trace-Id": "Root=1-6211e76e-4ccd65347cdbb7241b58fc45",
        "X-Forwarded-For": "91.108.6.89, 130.176.191.21",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "multiValueHeaders": {
        "Accept-Encoding": [
            "gzip, deflate"
        ],
        "CloudFront-Forwarded-Proto": [
            "https"
        ],
        "CloudFront-Is-Desktop-Viewer": [
            "true"
        ],
        "CloudFront-Is-Mobile-Viewer": [
            "false"
        ],
        "CloudFront-Is-SmartTV-Viewer": [
            "false"
        ],
        "CloudFront-Is-Tablet-Viewer": [
            "false"
        ],
        "CloudFront-Viewer-Country": [
            "NL"
        ],
        "Content-Type": [
            "application/json"
        ],
        "Host": [
            "tq9rr56bhc.execute-api.us-east-1.amazonaws.com"
        ],
        "User-Agent": [
            "Amazon CloudFront"
        ],
        "Via": [
            "1.1 9c100894a6989e860712c14c4867bd0a.cloudfront.net (CloudFront)"
        ],
        "X-Amz-Cf-Id": [
            "z-2Sk7Y6wfk5YnDwGbCJm9kqjcXAR-LyxSD_yH7_n469YUVXo5oxLg=="
        ],
        "X-Amzn-Trace-Id": [
            "Root=1-6211e76e-4ccd65347cdbb7241b58fc45"
        ],
        "X-Forwarded-For": [
            "91.108.6.89, 130.176.191.21"
        ],
        "X-Forwarded-Port": [
            "443"
        ],
        "X-Forwarded-Proto": [
            "https"
        ]
    },
    "queryStringParameters": null,
    "multiValueQueryStringParameters": null,
    "pathParameters": null,
    "stageVariables": null,
    "requestContext": {
        "resourceId": "93ctxg",
        "resourcePath": "/bot/webhook",
        "httpMethod": "POST",
        "extendedRequestId": "N1EZWE8FIAMFimA=",
        "requestTime": "20/Feb/2022:07:02:06 +0000",
        "path": "/dev/bot/webhook",
        "accountId": "285535506992",
        "protocol": "HTTP/1.1",
        "stage": "dev",
        "domainPrefix": "tq9rr56bhc",
        "requestTimeEpoch": 1645340526833,
        "requestId": "7ab41a7c-85d9-4b38-a261-f11597916dac",
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "sourceIp": "91.108.6.89",
            "principalOrgId": null,
            "accessKey": null,
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "Amazon CloudFront",
            "user": null
        },
        "domainName": "tq9rr56bhc.execute-api.us-east-1.amazonaws.com",
        "apiId": "tq9rr56bhc"
    },
    "body": "{\"update_id\":192810399,\n\"message\":{\"message_id\":15,\"from\":{\"id\":198940317,\"is_bot\":false,\"first_name\":\"Vikit\",\"username\":\"redblueshine\",\"language_code\":\"en\"},\"chat\":{\"id\":198940317,\"first_name\":\"Vikit\",\"username\":\"redblueshine\",\"type\":\"private\"},\"date\":1645340526,\"text\":\"hi\"}}",
    "isBase64Encoded": false
}




 * 
 */