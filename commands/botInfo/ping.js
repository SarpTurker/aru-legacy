/**
 * Aru
 * Ping Command
 */

module.exports = {
  options: {
    name: 'ping',
    usage: 'ping',
    description: 'Print response time (ms)',
    fullDescription: 'Print response time (ms).'
  },

  exec: function (bot, logger, msg, args) {
    let initTime = Date.now() // Store time at run

    msg.channel.createMessage('Calculating...')
      .then(editedMsg => {
        editedMsg.edit({ // Edit message with latency
          content: '',
          embed: {
            color: 16765404,
            fields: [
              {
                name: 'Shard Latency',
                value: `${msg.channel.guild.shard.latency} ms`
              },
              {
                name: 'Reply Latency',
                value: `${Date.now() - initTime} ms`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        })
      })
      .catch(err => {
        msg.channel.createMessage(`An error occured: ${err}`)

        logger.cmdUsageError(module.exports.options.name, msg, args, err)
      })

    logger.cmdUsage(module.exports.options.name, msg, args)
  }
}
