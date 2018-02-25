/**
 * Aru
 * Main Bot File
 */

// Setup files and modules
const Eris = require('eris')
const winston = require('winston')
const config = require('./config.json')

const events = {
  ready: require('./events/ready.js'),
  guildCreate: require('./events/guildCreate.js'),
  guildDelete: require('./events/guildDelete.js'),
  guildMemberAdd: require('./events/guildMemberAdd.js'),
  guildMemberRemove: require('./events/guildMemberRemove.js')
}

// Setup Winston
const logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'log.log' })
  ]
})

// Setup Eris
const bot = new Eris.CommandClient(config.token, {}, {
  defaultHelpCommand: false,
  prefix: config.prefix
})

// Bot event listeners
bot.on('error', logger.info)
bot.on('ready', () => { events.ready(bot, logger) })
bot.on('guildCreate', guild => { events.guildCreate(bot, guild, logger) })
bot.on('guildDelete', guild => { events.guildDelete(bot, guild, logger) })
bot.on('guildMemberAdd', (guild, member) => { events.guildMemberAdd(bot, guild, member, logger) })
bot.on('guildMemberRemove', (guild, member) => { events.guildMemberRemove(bot, guild, member, logger) })

// Connect to Discord
bot.connect()
