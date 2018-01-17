/**
 * Aru
 * Chatbot Command
 */

// Setup files and modules
const axios = require('axios')

module.exports = function (bot, logger) {
  bot.registerCommand('c', (msg, args) => {
    // Make GET request
    axios
      .get(`http://api.program-o.com/v2/chatbot/?bot_id=6&say=${args}&convo_id=discordaru_${msg.channel.id}&format=json`)
      .then(response => {
        // Create message
        bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** ${response.data.botsay.replace('Program-O', bot.user.username)}`)

        // Log command usage
        logger.info(new Date() + `: Chat command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args}`)
      })
      .catch(error => {
        // Create message
        bot.createMessage(msg.channel.id, 'Not feeling like talking :slight_frown: ')

        // Log command usage
        logger.info(new Date() + `: FAILURE: Chat command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} + ${error}`)
      })
  })
}
