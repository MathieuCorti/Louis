const Discord   = require("discord.js");
const Cleverbot = require("cleverbot.io");
const Giphy = require('giphy-api')();

const client  = new Discord.Client();
const bot     = new Cleverbot("Bfa7D3rlzjl3imaH", "KFWAdnsfyoDIRqyxMfZu3mWgwwkr5fus");
bot.setNick("Louis");

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag + "!");
});

bot.create(function (err, session) {
  console.log("Cleverbot logged !");
  client.on('message', msg => {
    if(!msg.author.bot) {
      answer(msg);
    }
  });
});

function answer(msg) {
  // If the bot is mentioned, respond with the cleverbot.io API
  if (msg.isMentioned(client.user)) {
    const cleanMessage = msg.content.replace(/(<.*?>|@.*?)(?: |\s)/g, "");
    bot.ask(cleanMessage, function (err, response) {
      msg.channel.send(err ? "An error has occurred :(" : response);
    });
  }
  // React with 🐔 if the message contains "chicken"
  if (msg.cleanContent.toLocaleLowerCase().indexOf("chicken") > -1) {
    msg.react("🐔").catch(function () {
      console.log("Failed to react to [" + msg.cleanContent + "].");
    });
  }
  // Send a gif if the message contains only one word
  if (!/\s/g.test(msg)) {
    let gifLimit = 50;
    Giphy.search({ q: msg, limit: gifLimit }, function (err, res) {
      if (err == null && res.data.length > 0) {
        let gifUrl = res.data[randomIntFromInterval(0, res.data.length)].url;
        if (gifUrl.length > 0) {
          msg.channel.send(gifUrl);
        }
      }
    });
  }

}

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

client.login('NDA3NDQ3ODE0MjIyNzc0Mjcy.DVBpKA.6zup2uPxyiigiHsZYfTnztVf1N4').catch(function () {
  console.log("Failed to log to Discord.");
});