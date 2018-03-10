/**
 * Aru
 * Main Bot File
 */

// Setup files and modules
const Eris = require('eris')
const glob = require('glob')
const logger = require('./utils/logger.js')
const findBetween = require('./utils/findBetween.js')
const config = require('./config.json')

// Setup Eris
const bot = new Eris.CommandClient(config.tokens.discord, {}, {
  defaultHelpCommand: false, // Disable default help command
  prefix: config.prefix // Set prefix to the one defined in config
})

// Attach Events
glob('./events/*.js', (err, files) => {
  if (err) { return logger.error(err) } // Log Error

  logger.info(`${files.length} events to load`) // Log number of events

  files.forEach(file => {
    let eventFile = require(file)
    let eventName = findBetween.findBetween(file, '/', '.') // Assign name of event

    bot.on(eventName, (...args) => { // Run on event emit
      eventFile(bot, logger, ...args) // Call event function
    })
  })
})

// Connect to Discord
bot.connect()
