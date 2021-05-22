const { App } = require("@slack/bolt");
require("dotenv").config();
var express = require('express');
const fs = require('fs')

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  socketMode:false,
  appToken: process.env.APP_TOKEN
});

app.command("/products", async ({ command, ack, say }) => {
    try {
        console.log(command);
      await ack();
      say("Yaaay! products command works!");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

app.command("/knowledge", async ({ command, ack, say }) => {
try {
    await ack();
    let raw = fs.readFileSync('data.json');
    // parse the raw bytes from the file as JSON
    let faqs= JSON.parse(raw);
    let message = { blocks: [] };
    faqs.data.map((faq) => {
    message.blocks.push(
        {
        type: "section",
        text: {
            type: "mrkdwn",
            text: "*Question*",
        },
        },
        {
        type: "section",
        text: {
            type: "mrkdwn",
            text: faq.question,
        },
        },
        {
            type: "section",
            text: {
            type: "mrkdwn",
            text: "*Answer*",
            },
        },
        {
            type: "section",
            text: {
            type: "mrkdwn",
            text: faq.answer,
            },
        }
    );
    });
    say(message);
} catch (error) {
    console.log("err");
    console.error(error);
}
});
app.command("/update", async ({ command, ack, say }) => {
try {
    await ack();
    const data = command.text.split("|");
    const newFAQ = {
    keyword: data[0].trim(),
    question: data[1].trim(),
    answer: data[2].trim(),
    };
    // save data to db.json
    fs.readFile("data.json", function (err, data) {
    const json = JSON.parse(data);
    json.data.push(newFAQ);
    fs.writeFile("data.json", JSON.stringify(json), function (err) {
        if (err) throw err;
        console.log("Successfully saved to data.json!");
    });
    });
    say(`You've added a new FAQ with the keyword *${newFAQ.keyword}.*`);
} catch (error) {
    console.log("err");
    console.error(error);
}
});

app.command("/test", async ({ command, ack, say }) => {
    try {
      console.log(command);
      await ack();
      say("Yaaay! test command works!");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

app.message("hello", async ({ command, say }) => {
    try {
      say("Hello! This is Pavan !");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log("SLACK_SIGNING_SECRET", process.env.SLACK_SIGNING_SECRET);
  console.log("SLACK_BOT_TOKEN", process.env.SLACK_BOT_TOKEN);
  console.log(`Slack Bolt app is running on port ${port}!`);
})();