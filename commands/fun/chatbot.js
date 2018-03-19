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

    // Test to make sure user put in args
    if (!args[0]) {
      msg.channel.createMessage(`Please put in a chat message following \`${module.exports.options.name}\` to chat with the bot.`)
      logger.cmdUsageError(module.exports.options.name, msg, args, 'No chat text')
      return
    }

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
        msg.channel.createMessage(`An error has occured ${err}`)

        logger.cmdUsageError(module.exports.options.name, msg, args, err)
      })
  }
}
