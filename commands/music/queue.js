/**
 * Aru
 * Queue Command
 */

module.exports = {
  options: {
    name: 'queue',
    usage: 'queue',
    description: 'View a list of songs queued',
    fullDescription: 'View a list of songs queued.',
    guildOnly: true
  },

  exec: function (bot, logger, msg, args) {
    const musicUtils = require('../../utils/musicUtils.js')

    if (musicUtils.servers[msg.member.guild.id]) { // Test to see if there is a song in queue
      if (musicUtils.servers[msg.member.guild.id].queue[0]) {
        let queue = ''

        for (let i = 0; i < musicUtils.servers[msg.member.guild.id].queue.length; i++) {
          queue += `**${i + 1}. ${musicUtils.servers[msg.member.guild.id].queue[i].title} [${musicUtils.servers[msg.member.guild.id].queue[i].length}]** requested by **${musicUtils.servers[msg.member.guild.id].queue[i].requester.username}#${musicUtils.servers[msg.member.guild.id].queue[i].requester.discriminator}**\n` // Print songs in queue
        }
        msg.channel.createMessage({
          embed: {
            color: 16765404,
            title: '🎵 Queue',
            description: queue,
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        })

        logger.cmdUsage(module.exports.options.name, msg, args)
      }
    } else {
      msg.channel.createMessage('Looks like there is no song in the queue') // Notify that there is no song in the queue
      logger.cmdUsageError(module.exports.options.name, msg, args, 'No song in queue')
    }
  }
}
