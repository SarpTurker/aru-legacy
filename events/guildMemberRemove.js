/**
 * Aru
 * Guild Member Remove Event
 */

// Setup files and modules
const guildModel = require('../db/models/guild.js')

module.exports = function (bot, logger, guild, member) {
  guildModel.findOne({ _id: guild.id }, 'notifications', (err, server) => { // Query for notifications
    if (err) { return logger.error(err) } // Log error
    if (server.notifications && server.notifications.leaveMsgChannel) {
      guild.channels.find((channel) => {
        if (channel.id === server.notifications.leaveMsgChannel) {
          bot.createMessage(server.notifications.leaveMsgChannel, server.notifications.leaveMsgText.replace('{mention}', member.mention).replace('{guild_name}', guild.name).replace('{username}', member.username).replace('{discriminator}', member.discriminator).replace('{id}', member.id).replace('{guild}', guild.name))
        }
      })
    }
  })
}
