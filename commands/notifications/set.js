/**
 * Aru
 * Set Notification Command
 */

module.exports = {
  options: {
    name: 'set',
    usage: 'set <type> <message>',
    description: 'Set a notification for join/leave along with other events. Message part only applicable to commands other then join/leave. See extended help for more info.',
    fullDescription: '**join** or **leave**: Sets the join or leave message in server to the channel the message is sent in. For custom messages entering **{mention}** **{guild_name}** **{username}** **{discriminator}** **{guild}** or **{id}** will replace character in join messages with element.\n**Example:** set join Welcome {mention} to {guild}!\n**memberupdate**: Notify if user changed their nickname.\n**messagedelete**: Notify if a message has been deleted.\n**messageupdate**: Notify that message has been edited. Displays before and after text.',
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
    const arrayJoiner = require('../../utils/arrayJoiner.js')

    if (args[0] !== 'join' && args[0] !== 'leave' && args[0] !== 'memberupdate' && args[0] !== 'messagedelete' && args[0] !== 'messageupdate') {
      msg.channel.createMessage(`Please put in a valid type: join, leave, memberupdate, messagedelete, messageupdate.`)
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Invalid type')
      return
    }

    if (args[0] === 'join' || args[0] === 'leave') {
      if (!args[1]) {
        msg.channel.createMessage(`Please put in a join message following \`${module.exports.options.name}\`.`)
        logger.cmdUsageError(module.exports.options.name, msg, args, 'No message')
        return
      }

      if (args[0] === 'join') {
        args.shift() // Remove type from args
        let joinMsgText = arrayJoiner(args) // Join array
        guildModel.update({ _id: msg.channel.guild.id }, { $set: {
          'notifications.joinMsgText': joinMsgText,
          'notifications.joinMsgChannel': msg.channel.id
        }}, (err) => { if (err) { return logger.error(err) } })

        msg.channel.createMessage({
          embed: {
            color: 16765404,
            title: '📝 Join Message Set',
            description: `Join message has been set to ${joinMsgText} in **#${msg.channel.name}**.`,
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
        args.shift() // Remove type from args
        let leaveMsgText = arrayJoiner(args) // Join array
        guildModel.update({ _id: msg.channel.guild.id }, { $set: {
          'notifications.leaveMsgText': leaveMsgText,
          'notifications.leaveMsgChannel': msg.channel.id
        }}, (err) => { if (err) { return logger.error(err) } })

        msg.channel.createMessage({
          embed: {
            color: 16765404,
            title: '📝 Leave Message Set',
            description: `Leave message has been set to ${leaveMsgText} in **#${msg.channel.name}**.`,
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
    }

    if (args[0] === 'memberupdate') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.guildMemberUpdateChannel': msg.channel.id
      }}, (err) => { if (err) { return logger.error(err) } })

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '📝 Member Update Notification Set',
          description: `Will log when a user changes their nickname in **#${msg.channel.name}**.`,
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
        'notifications.messageDeletedChannel': msg.channel.id
      }}, (err) => { if (err) { return logger.error(err) } })

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '📝 Member Deleted Notification Set',
          description: `Will log when a user deletes their message in **#${msg.channel.name}**.`,
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
        'notifications.messageUpdateChannel': msg.channel.id
      }}, (err) => { if (err) { return logger.error(err) } })

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '📝 Message Update Notification Set',
          description: `Will log when a user edits their message in **#${msg.channel.name}**.`,
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
