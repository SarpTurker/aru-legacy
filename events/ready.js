/**
 * Aru
 * Ready Event
 */

// Setup files and modules
const requireDir = require('require-dir')
const statusManager = require('../utils/statusManager.js')
const commands = requireDir('../commands')

module.exports = function (bot, logger) {
  // Log start message
  logger.info(new Date() + ': ' + 'Bot ' + 'is currently logged in as ' + bot.user.username + '#' + bot.user.discriminator + ' and ' + 'currently on ' + bot.guilds.size + ' servers and serving ' + bot.users.size + ' users')

  // Set game status
  statusManager.setStatus(bot, logger)

  // Post stats
  statusManager.postStats(bot, logger)

  // Load commands
  Object.values(commands).forEach(command => command(bot, logger))
}
