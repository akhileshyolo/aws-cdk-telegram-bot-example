Advantage of AWS CDK over Cloudformation:
- Use logic (if statements, for-loops, etc) when defining your infrastructure
- Use object-oriented techniques to create a model of your system
- Define high level abstractions, share them, and publish them to your team, company, or community
- Organize your project into logical modules
- Share and reuse your infrastructure as a library
- Testing your infrastructure code using industry-standard protocols
- Use your existing code review workflow
Code completion within your IDE


```javascript
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
      code: lambda.Code.fromAsset("assets/lambda/telegram-bot"),
      architecture: lambda.Architecture.ARM_64,
      environment: {
        'CURRENT_ENV': 'dev',
      }
    });

    // All constructs take these same three arguments : scope, id/name, props
    // defines an API Gateway REST API resource backed by our "telegrambot-api" function.
    const restApi = new apigw.RestApi(this, "telegrambot-api", { deploy: false });

    const method = restApi.root
      .addResource("bot")
      .addMethod("GET", new apigw.LambdaIntegration(lambdaTelegram, { proxy: true }));

    // All constructs take these same three arguments : scope, id/name, props
    const devDeploy = new apigw.Deployment(this, "dev-deployment", { api: restApi });

    // All constructs take these same three arguments : scope, id/name, props
    new apigw.Stage(this, "devStage", {
      deployment: devDeploy,
      stageName: 'dev' // If not passed, by default it will be 'prod'
    });

    // All constructs take these same three arguments : scope, id/name, props
    new cdk.CfnOutput(this, "BotURL", {
      value: `https://${restApi.restApiId}.execute-api.${this.region}.amazonaws.com/beta/bot`,
    });
  }
}

module.exports = { TelegramBotStack };

```