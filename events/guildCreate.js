/**
 * Aru
 * Guild Create Event
 */

// Setup files and modules
const statusManager = require('../utils/statusManager.js')

module.exports = function (bot, guild, logger) {
  // Post stats
  statusManager.postStats(bot, logger)

  // Log event
  logger.info(new Date() + ': ' + 'Bot has joined ' + guild.name + ' ID#' + guild.id)
}
