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
                title: `Message deleted by ${message.author.username}#${message.author.discriminator}`,
                description: `${message.content}`.substr(0, 2048),
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
