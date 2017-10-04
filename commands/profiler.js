const config = require('../config.json')
const moment = require('moment')

const timeFormat = config.time_format

module.exports = function (bot, logger) {
  bot.registerCommand('profile', msg => {
    if (msg.mentions.length === 0) {
      return
    }

    const User = msg.channel.guild.members.get(msg.mentions[0].id)

    const embed = {
      author: {
        name: User.user.username + '#' + User.user.discriminator,
        icon_url: User.user.avatarURL,
        url: User.user.avatarURL
      },
      title: 'User Information:',
      color: 16765404,
      fields: [
        {
          name: 'Nickname',
          value: User.nick !== null ? User.nick : 'None',
          inline: true
        },
        {
          name: 'Playing',
          value: User.game !== null ? User.game.name : 'Currently not Playing',
          inline: true
        },
        {
          name: 'Join Date',
          value:
            moment(User.joinedAt)
              .utc()
              .format(timeFormat) +
            ' ' +
            moment(User.joinedAt).fromNow(),
          inline: true
        },
        {
          name: 'User ID',
          value: User.id,
          inline: true
        },
        {
          name: 'Status',
          value: User.status,
          inline: true
        },
        {
          name: 'Creation Date',
          value:
            moment(User.user.createdAt)
              .utc()
              .format(timeFormat) +
            ' ' +
            moment(User.user.createdAt).fromNow(),
          inline: true
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: bot.user.avatarURL,
        text: bot.user.username
      }
    }
    bot.createMessage(msg.channel.id, {
      embed: embed
    })
    const command = `Profile (on ${User.user.username}#${User.user.discriminator})`
    logger.commandUsed(bot, msg, command)
  })
  bot.registerCommand('serverinfo', msg => {
    if (msg.channel === msg.channel.PrivateChannel) {
      return
    }
    const Server = msg.guild
    const embed = {
      author: {
        name: Server.name,
        icon_url: Server.iconURL,
        url: Server.iconURL
      },
      title: 'Server Information:',
      color: 16765404,
      fields: [
        {
          name: 'ID',
          value: Server.id,
          inline: true
        },
        {
          name: 'Member Count',
          value: Server.memberCount,
          inline: true
        },
        {
          name: 'Verification Level',
          value: Server.verificationLevel,
          inline: true
        },
        {
          name: 'Creation Date',
          value:
            moment(Server.createdAt)
              .utc()
              .format(timeFormat) +
            ' ' +
            moment(Server.createdAt).fromNow(),
          inline: true
        },
        {
          name: 'AFK Channel ID',
          value: Server.afkChannelID !== null ? Server.afkChannelID : 'None',
          inline: true
        },
        {
          name: 'Region',
          value: Server.region,
          inline: true
        }
      ],
      thumbnail: {
        url: Server.iconURL
      },
      timestamp: new Date(),
      footer: {
        icon_url: bot.user.avatarURL,
        text: bot.user.username
      }
    }
    bot.createMessage(msg.channel.id, {
      embed: embed
    })
    const command = `Server (in ${msg.guild.name})`
    logger.commandUsed(bot, msg, command)
  })
}
