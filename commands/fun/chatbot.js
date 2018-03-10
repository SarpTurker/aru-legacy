/**
 * Aru
 * Chatbot Command
 */

module.exports = {
  options: {
    name: 'c',
    usage: 'c <message>',
    description: 'Chat with the bot',
    fullDescription: 'Chat with the bot through Program-O API.'
  },

  exec: function (bot, logger, msg, args) {
    // Setup files and modules
    const axios = require('axios')

    // Make GET request
    axios
      .get(`http://api.program-o.com/v2/chatbot/?bot_id=6&say=${args}&convo_id=discordaru_${msg.author.id}&format=json`)
      .then(response => {
        // Create message
        msg.channel.createMessage({
          embed: {
            author: {
              name: msg.author.username + '#' + msg.author.discriminator,
              icon_url: msg.author.avatarURL
            },
            color: 16765404,
            description: `${response.data.botsay.replace('Program-O', bot.user.username).replace('</br>', '').replace('Elizabeth', 'Pyro')}`,
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        })

        logger.cmdUsage(module.exports.options.name, msg, args)
      })
      .catch(err => {
        // Test to see if user put in args
        if (!args[0]) {
          msg.channel.createMessage('Please put in a message following `c` to chat with the bot. ')
        } else {
          msg.channel.createMessage('Not feeling like talking :slight_frown: ')
        }

        logger.cmdUsageError(module.exports.options.name, msg, args, err)
      })
  }
}
