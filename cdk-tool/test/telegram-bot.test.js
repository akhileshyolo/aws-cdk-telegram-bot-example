const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const TelegramBot = require('../lib/telegram-bot-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TelegramBot.TelegramBotStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
