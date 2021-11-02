const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const apigw = require("@aws-cdk/aws-apigateway");

class TelegramBotStack extends cdk.Stack {
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
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset("assets/lambda/telegram-bot"),
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    const restApi = new apigw.RestApi(this, "telegrambot-api", {
      deploy: false,
    });
    const method = restApi.root
      .addResource("bot")
      .addMethod("GET", new apigw.LambdaIntegration(lambdaTelegram, { proxy: true }));

    // development stage
    const devDeploy = new apigw.Deployment(this, "dev-deployment", {
      api: restApi,
    });
    new apigw.Stage(this, "devStage", {
      deployment: devDeploy,
      stageName: 'dev'
    });
    new cdk.CfnOutput(this, "BotURL", {
      value: `https://${restApi.restApiId}.execute-api.${this.region}.amazonaws.com/beta/bot`,
    });
  }
}

module.exports = { TelegramBotStack };
