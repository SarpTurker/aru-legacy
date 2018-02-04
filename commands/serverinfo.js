/**
 * Aru
 * Server Info Command
 */

// Setup files and modules
const config = require('../config.json')
const moment = require('moment')

const timeFormat = config.time_format

module.exports = function (bot, logger) {
  bot.registerCommand('serverinfo', msg => {
    if (msg.channel === msg.channel.PrivateChannel) {
      bot.createMessage(msg.channel.id, 'Command is not usable in private messages.')
      return
    }
    const server = msg.channel.guild
    const embed = {
      author: {
        name: server.name,
        icon_url: server.iconURL,
        url: server.iconURL
      },
      title: 'Server Information:',
      color: 16765404,
      fields: [
        {
          name: 'ID',
          value: server.id,
          inline: true
        },
        {
          name: 'Member Count',
          value: server.memberCount,
          inline: true
        },
        {
          name: 'Verification Level',
          value: server.verificationLevel,
          inline: true
        },
        {
          name: 'Creation Date',
          value: `${moment(server.createdAt).utc().format(timeFormat)} ${moment(server.createdAt).fromNow()}`,
          inline: true
        },
        {
          name: 'AFK Channel ID',
          value: server.afkChannelID !== null ? server.afkChannelID : 'None',
          inline: true
        },
        {
          name: 'Region',
          value: server.region,
          inline: true
        }
      ],
      thumbnail: {
        url: server.iconURL
      },
      timestamp: new Date(),
      footer: {
        icon_url: bot.user.avatarURL,
        text: bot.user.username
      }
    }

    // Create message
    bot.createMessage(msg.channel.id, {
      embed: embed
    })

    // Log command usage
    logger.info(new Date() + `: Server info command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}`)
  })
}
