/**
 * Aru
 * Help Command
 */

module.exports = {
  options: {
    name: 'help',
    usage: 'help',
    description: 'DM a list of commands',
    fullDescription: 'DM a list of commands. If a name of a command is added after the command call a full description of the command will be given in chat Ex: help <command name>.'
  },

  exec: function (bot, logger, msg, args) {
    // Setup files and modules
    const config = require('../../config.json')

    function createCommandList () {
      let commands = '' // Hold command string

      for (let command in bot.commands) { // Create field for group
        commands += `**${config.prefix}`
        commands += bot.commands[command].usage
        commands += '** - '
        commands += bot.commands[command].description
        commands += '\n'
      }
      commands += `\nRun **${config.prefix} help <command name>** for more info on a specific command\n`

      return commands
    }

    if (args[0] in bot.commands) {
      if (bot.commands[args[0]]) {
        msg.channel.createMessage({
          embed: {
            color: 16765404,
            title: bot.commands[args[0]].label,
            description: `**Usage:** ${bot.commands[args[0]].usage}\n\n**Description:**\n${bot.commands[args[0]].fullDescription}`,
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        })
        logger.cmdUsage(module.exports.options.name, msg, args)
      } else {
        msg.channel.createMessage(`Command not found.`)
        logger.cmdUsageError(module.exports.options.name, msg, args, 'Command not found')
      }
    } else {
      bot.getDMChannel(msg.author.id)
        .then(channel => {
          channel.createMessage({
            embed: {
              color: 16765404,
              title: 'Help',
              description: createCommandList(),
              timestamp: new Date(),
              footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.username
              }
            }
          })

          if (!msg.channel.guild) { // Tell user PM has been sent if message was sent from guild
            msg.channel.createMessage(`:mailbox_with_mail: Help sent to PM.`)
          }

          logger.cmdUsage(module.exports.options.name, msg, args)
        })
        .catch(err => {
          bot.createMessage(msg.channel.id, `Could not send help message, check that bot has permission to PM you.`)
          logger.cmdUsageError(module.exports.options.name, msg, args, err)
        })
    }
  }
}
