/**
 * Aru
 * Ready Event
 */

// Setup files and modules
const glob = require('glob')
const statusManager = require('../utils/statusManager.js')

module.exports = function (bot, logger) {
  logger.info(`Bot is currently logged in as ${bot.user.username}#${bot.user.discriminator} and currently on ${bot.guilds.size} servers and serving ${bot.users.size} users`) // Log start message
  statusManager.setStatus(bot, logger) // Set game status
  statusManager.postStats(bot, logger) // Post stats

  // Load Commands
  glob('./commands/**/*.js', (err, files) => {
    if (err) { return logger.error(err) } // Log error

    logger.info(`${files.length} commands to load`) // Log number of events

    files.forEach(file => {
      let command = require(`.${file}`)

      bot.registerCommand(command.options.name, (msg, args) => { command.exec(bot, logger, msg, args) }, command.options) // Register command
    })
  })
}
