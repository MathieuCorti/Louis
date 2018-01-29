const Discord   = require("discord.js");
const Cleverbot = require("cleverbot.io");

const client  = new Discord.Client();
const bot     = new Cleverbot("Bfa7D3rlzjl3imaH", "KFWAdnsfyoDIRqyxMfZu3mWgwwkr5fus");
bot.setNick("Louis");

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag + "!");
});

bot.create(function (err, session) {
  console.log("Cleverbot logged !");
  client.on('message', msg => {
    if(msg.author.id !== bot.user.id) {
      answer(msg);
    }
  });
});

// If it's not the bot itself
function answer(msg) {
  if (msg.isMentioned(client.user)) {
    const cleanMessage = msg.content.replace(/(<.*?>|@.*?)(?: |\s)/g, "");
    bot.ask(cleanMessage, function (err, response) {
      msg.channel.send(err ? "An error has occurred :(" : response);
    });
  }
  if (msg.cleanContent.indexOf("chicken") > -1) {
    msg.react("🐔").catch(function () {
      console.log("Failed to react to [" + msg.cleanContent + "].");
    });
  }
}

client.login('NDA3NDQ3ODE0MjIyNzc0Mjcy.DVBpKA.6zup2uPxyiigiHsZYfTnztVf1N4').catch(function () {
  console.log("Failed to log to Discord.");
});