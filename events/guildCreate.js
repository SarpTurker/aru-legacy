/**
 * Aru
 * Guild Create Event
 */

// Setup files and modules
const statusManager = require('../utils/statusManager.js')

module.exports = function (bot, logger, guild) {
  statusManager.postStats(bot, logger) // Post stats
  logger.info(`Bot has joined ${guild.name} ID#${guild.id}`) // Log event
}
