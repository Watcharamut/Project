const functions = require('firebase-functions');
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer IjkB40tCat9xjl/Eh4xOMUFcwunapBJPFrAmPy3wxqHk4z+Q9Gh6V9/GrB/oR0tO/MiZZyzEiqZFa6VqD70ud3sK7qcyJcVwEYLUiplegkJDoQ9pTpoVWf756H5bwwa0CTBuS2cZS7gMlCi3AcZ+3wdB04t89/1O/w1cDnyilFU=`
};

exports.webhook = functions.https.onRequest((req, res) => {
    if (req.method === "POST") {
      let event = req.body.events[0]
      if (event.type === "message" && event.message.type === "text") {
        postToDialogflow(req);
      } else {
        reply(req);
      }
    }
    return res.status(200).send(req.method);
  });
  
  const reply = req => {
    return request.post({
      uri: `${LINE_MESSAGING_API}/reply`,
      headers: LINE_HEADER,
      body: JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: [
          {
            type: "text",
            text: JSON.stringify(req.body)
          }
        ]
      })
    });
  };
  const postToDialogflow = req => {
    req.headers.host = "bots.dialogflow.com";
    return request.post({
      uri: "https://bots.dialogflow.com/line/21dd81cd-2fa1-4ed6-af1d-f298055c06e7/webhook",
      headers: req.headers,
      body: JSON.stringify(req.body)
    });
  };