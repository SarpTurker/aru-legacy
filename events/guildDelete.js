/**
 * Aru
 * Guild Delete Event
 */

// Setup files and modules
const statusManager = require('../utils/statusManager.js')

module.exports = function (bot, guild, logger) {
  // Post stats
  statusManager.postStats(bot, logger)

  // Log event
  logger.info(new Date() + ': ' + 'Bot has left ' + guild.name + ' ID#' + guild.id)
}
