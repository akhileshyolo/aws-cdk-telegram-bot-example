var axios = require('axios');

exports.handler = async function(event) {
    console.log("request:", JSON.stringify(event, undefined, 2));

    if(event.path==="/bot" || event.path==="/bot/"){
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Hello, CDK! You've hit ${process.env.AWS_LAMBDA_FUNCTION_NAME} with ${process.env.AWS_LAMBDA_FUNCTION_VERSION}\n`
      };
    }
    
    try {
      if(event.body){
        const jsonData = JSON.parse(event.body).message;
        await sendReply(jsonData.from.id, 'Processing data:'+jsonData.text);
      }
    } catch(e){
      console.log('Error occured:',e);
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: `Success`
    };
  };

function sendReply(chatId, textReply){
  var data = JSON.stringify({
    "chat_id": chatId,
    "text": textReply,
    "disable_notification": true
  });
  
  const config = {
    method: 'post',
    url: 'https://api.telegram.org/bot5118686429:AAHtgBvYLyrTSIUJ-iNRmV5MiuTYcSfAXIY/sendMessage',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  return axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}