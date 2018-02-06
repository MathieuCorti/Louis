// Requires
const Discord   = require("discord.js");
const Cleverbot = require("cleverbot.io");
const Giphy     = require('giphy-api')();
const low       = require('lowdb');
const FileSync  = require('lowdb/adapters/FileSync');

const adapter = new FileSync('config.json');
const config = low(adapter);

const client  = new Discord.Client();
const bot     = new Cleverbot(config.get('cleverbot.apiUser').value(), config.get('cleverbot.apiKey').value());
bot.setNick(config.get('cleverbot.bot.name').value());

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
    cleverbotAnswer(msg);
  } else if (msg.channel.name === "talktolouis" || isSpeaking(10)) { // Is randomly speaking even if we don't mentioned him, or always speaking when 'talktolouis'
    cleverbotAnswer(msg);
  }
  // React with 🐔 if the message contains "chicken"
  if (msg.cleanContent.toLocaleLowerCase().indexOf("chicken") > -1) {
    msg.react("🐔").catch(function () {
      console.log("Failed to react to [" + msg.cleanContent + "].");
    });
  }

  // Randomly throwing gif sometimes if the message contains only one word
  if (!/\s/g.test(msg) && isSpeaking(5)) {
    gifAnswer(msg);
  }

}

function cleverbotAnswer(msg) {
  msg.channel.startTyping();
  const cleanMessage = msg.content.replace(/(<.*?>|@.*?)(?: |\s)/g, "");
  bot.ask(cleanMessage, function (err, response) {
    msg.channel.stopTyping(true);
    msg.channel.send(err ? "An error has occurred :(" : response);
  });
}

function gifAnswer(msg) {
  msg.channel.startTyping();
  let gifLimit = 50;
  Giphy.search({ q: msg, limit: gifLimit }, function (err, res) {
    msg.channel.stopTyping(true);
    if (err == null && res.data.length > 0) {
      let gifUrl = res.data[randomIntFromInterval(0, res.data.length, 3)].url;
      if (gifUrl.length > 0) {
        msg.channel.send(gifUrl);
      }
    }
  });
}

// higher degree is less interventions
function isSpeaking(degree) {
  return (randomIntFromInterval(0, degree, 1) === 0);
}

// Higher degree lower result, set to 1 to get normal behavior
function randomIntFromInterval(min, max, degree) {
  return Math.floor(randomBalanced(degree) * (max - min + 1) + min);
}

function randomBalanced(degree) {
  return Math.pow(Math.random(), degree);
}

client.login(config.get('discord.token').value()).catch(function () {
  console.log("Failed to log to Discord.");
});