/**
 * Aru
 * Message Delete Event
 */

// Setup files and modules
const guildModel = require('../db/models/guild.js')

module.exports = function (bot, logger, message) {
  if (message.channel.guild) {
    guildModel.findOne({ _id: message.channel.guild.id }, 'notifications', (err, server) => { // Query for notifications
      if (err) { return logger.error(err) } // Log error
      if (server.notifications.messageDeletedChannel) {
        message.channel.guild.channels.find((channel) => {
          if (channel.id === server.notifications.messageDeletedChannel) {
            channel.createMessage({
              embed: {
                color: 16765404,
                title: `📝 ${message.author.username}#${message.author.discriminator}'s Message Deleted in #${message.channel.name}`,
                description: `${message.content}`.substr(0, 2048),
                image: {
                  url: message.attachments[0].url != null ? message.attachments[0].url : ''
                },
                timestamp: new Date(),
                footer: {
                  icon_url: bot.user.avatarURL,
                  text: bot.user.username
                }
              }
            })
          }
        })
      }
    })
  }
}
