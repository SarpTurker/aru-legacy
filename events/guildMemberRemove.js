/**
 * Aru
 * Guild Create Event
 */

const config = require('../config.json')

module.exports = function (bot, guild, member, logger) {
  if (config.messages.join_leave[guild.id]) {
    bot.createMessage(config.messages.join_leave[guild.id].channel, config.messages.join_leave[guild.id].leave_message)
  }
  
  // Log event
  logger.info(new Date() + `: ${member.username}#${member.discriminator} has left ${guild.name} ID#${guild.id}`)
}
