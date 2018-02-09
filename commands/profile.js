/**
 * Aru
 * Profile Command
 */

// Setup files and modules
const config = require('../config.json')
const moment = require('moment')

module.exports = function (bot, logger) {
  bot.registerCommand('profile', msg => {
    if (msg.mentions.length === 0) {
      logger.info(new Date() + `: FAILURE: Profile command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}. No user was mentioned.`)
      return
    }

    let user = msg.channel.guild.members.get(msg.mentions[0].id)

    let embed = {
      author: {
        name: user.user.username + '#' + user.user.discriminator,
        icon_url: user.user.avatarURL,
        url: user.user.avatarURL
      },
      title: 'User Information:',
      color: 16765404,
      fields: [
        {
          name: 'Nickname',
          value: user.nick !== null ? user.nick : 'None',
          inline: true
        },
        {
          name: 'Playing',
          value: user.game !== null ? user.game.name : 'Currently not Playing',
          inline: true
        },
        {
          name: 'Join Date',
          value: `${moment(user.joinedAt).utc().format(config.time_format)} ${moment(user.joinedAt).fromNow()}`,
          inline: true
        },
        {
          name: 'User ID',
          value: user.id,
          inline: true
        },
        {
          name: 'Status',
          value: user.status,
          inline: true
        },
        {
          name: 'Creation Date',
          value: `${moment(user.user.createdAt).utc().format(config.time_format)} ${moment(user.user.createdAt).fromNow()}`,
          inline: true
        }
      ],
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
    logger.info(new Date() + `: Profile command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} on ${user.user.username}#{user.user.discriminator}`)
  })
}
