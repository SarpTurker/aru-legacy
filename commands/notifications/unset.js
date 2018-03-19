/**
 * Aru
 * Set Notification Command
 */

module.exports = {
  options: {
    name: 'unset',
    usage: 'unset <type>',
    description: 'Unsets notification. See extended help for more info.',
    fullDescription: 'Unsets notification. Types: join, leave, memberupdate, messagedelete, messageupdate',
    requirements: {
      permissionMessage: 'Only users with the Manage Server permission will be able to use this command.',
      permissions: {
        'manageGuild': true
      }
    },
    guildOnly: true
  },

  exec: function (bot, logger, msg, args) {
    // Setup files and modules
    const guildModel = require('../../db/models/guild.js')

    if (args[0] !== 'join' && args[0] !== 'leave' && args[0] !== 'memberupdate' && args[0] !== 'messagedelete' && args[0] !== 'messageupdate') {
      msg.channel.createMessage(`Please put in a valid type: join, leave, memberupdate, messagedelete, messageupdate.`)
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Invalid type')
      return
    }

    if (args[0] === 'join') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.joinMsgChannel': ''
      }}, (err) => { if (err) { return logger.error(err) } })

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: 'Join Notification Unset',
          description: `Join notification will no longer be displayed.`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      })

      logger.cmdUsage(module.exports.options.name, msg, args)
      return
    }

    if (args[0] === 'leave') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.leaveMsgChannel': ''
      }}, (err) => { if (err) { return logger.error(err) } })

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: 'Leave Notification Unset',
          description: `Leave notification will no longer be displayed.`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      })

      logger.cmdUsage(module.exports.options.name, msg, args)
      return
    }

    if (args[0] === 'memberupdate') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.guildMemberUpdateChannel': ''
      }}, (err) => { if (err) { return logger.error(err) } })

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: 'Member Update Notification Unset',
          description: `Nickname changes will no longer be displayed.`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      })

      logger.cmdUsage(module.exports.options.name, msg, args)
      return
    }

    if (args[0] === 'messagedelete') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.messageDeletedChannel': ''
      }}, (err) => { if (err) { return logger.error(err) } })

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: 'Message Delete Notification Unset',
          description: `Message delete notifications will no longer be displayed.`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      })

      logger.cmdUsage(module.exports.options.name, msg, args)
      return
    }

    if (args[0] === 'messageupdate') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.messageUpdateChannel': ''
      }}, (err) => { if (err) { return logger.error(err) } })

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: 'Message Edit Notification Unset',
          description: `Message edit notifications will no longer be displayed.`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      })

      logger.cmdUsage(module.exports.options.name, msg, args)
    }
  }
}
