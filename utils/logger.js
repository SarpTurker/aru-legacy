/**
 * Aru
 * Logger
 */

// Setup files and modules
const winston = require('winston')

// Setup Winston
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ timestamp: true }), // Log to console
    new (winston.transports.File)({ filename: 'log.log', timestamp: true }) // Log to file
  ]
})

function info (args) {
  logger.info(args)
}

function error (args) {
  logger.error(args)
}

function cmdUsage (cmdName, msg, args) {
  if (!msg.channel.guild) {
    logger.info(`${cmdName} used by ${msg.author.username}#${msg.author.discriminator} in private messages with args ${args}`)
  } else {
    logger.info(`${cmdName} used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}#${msg.channel.name} with args ${args}`)
  }
}

function cmdUsageError (cmdName, msg, args, err) {
  if (!msg.channel.guild) {
    logger.error(`FAILURE: ${cmdName} used by ${msg.author.username}#${msg.author.discriminator} in private messages with args ${args} ${err}`)
  } else {
    logger.error(`FAULURE: ${cmdName} used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}#${msg.channel.name} with args ${args} ${err}`)
  }
}

module.exports = {
  logger: logger,
  error: error,
  info: info,
  cmdUsage: cmdUsage,
  cmdUsageError: cmdUsageError
}
