/**
 * Aru
 * Guild Member Update Event
 */

// Setup files and modules
const guildModel = require('../db/models/guild.js')

module.exports = function (bot, logger, guild, member, oldMember) {
  guildModel.findOne({ _id: guild.id }, 'notifications', (err, server) => { // Query for notifications
    if (err) { return logger.error(err) } // Log error
    if (server.notifications.guildMemberUpdateChannel) {
      guild.channels.find((channel) => {
        if (channel.id === server.notifications.guildMemberUpdateChannel) {
          if (member.nick) {
            if (member.nick !== oldMember.nick) {
              channel.createMessage({
                embed: {
                  color: 16765404,
                  title: 'Nickname Change Detected',
                  description: `**${member.user.username}#${member.user.discriminator}** has changed their nickname from **${oldMember.nick || 'No Nickname'}** to **${member.nick || 'No Nickname'}**`,
                  timestamp: new Date(),
                  footer: {
                    icon_url: bot.user.avatarURL,
                    text: bot.user.username
                  }
                }
              })
            }
          }
        }
      })
    }
  })
}
