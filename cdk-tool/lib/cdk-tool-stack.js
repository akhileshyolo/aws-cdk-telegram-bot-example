const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const apigw = require("@aws-cdk/aws-apigateway");

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
      code: lambda.Code.fromAsset("../lambda/telegram-bot/"), // from parent directory containing package.json
      architecture: lambda.Architecture.ARM_64,
      environment: {
        'CURRENT_ENV': 'dev',
      }
    });

    // console.log("Check inner properties of Lambda", lambdaTelegram);

    // All constructs take these same three arguments : scope, id/name, props
    // defines an API Gateway REST API resource backed by our "telegrambot-api" function.
    const restApi = new apigw.RestApi(this, "telegrambot-api", { deploy: false });

    const method = restApi.root
      .addResource("bot")
      .addMethod("GET", new apigw.LambdaIntegration(lambdaTelegram, { proxy: true }));

    // All constructs take these same three arguments : scope, id/name, props
    const devDeploy = new apigw.Deployment(this, "dev-deployment", { api: restApi });

    // All constructs take these same three arguments : scope, id/name, props
    const devStage = new apigw.Stage(this, "devStage", {
      deployment: devDeploy,
      stageName: 'dev' // If not passed, by default it will be 'prod'
    });

    // console.log("Check inner properties of API Stage", devStage);


    // All constructs take these same three arguments : scope, id/name, props
    new cdk.CfnOutput(this, "BotURL", {
      value: `https://${restApi.restApiId}.execute-api.${this.region}.amazonaws.com/dev/bot`,
    });
  }
}

module.exports = { CdkToolStack };
