/**
 * Aru
 * Skip Command
 */

module.exports = {
  options: {
    name: 'skip',
    usage: 'skip',
    description: 'Skip currently playing song',
    fullDescription: 'Skip currently playing song.',
    guildOnly: true
  },

  exec: function (bot, logger, msg, args) {
    const musicUtils = require('../../utils/musicUtils.js')

    if (musicUtils.servers[msg.member.guild.id]) { // Test to see if bot is in a connection
      if (musicUtils.servers[msg.member.guild.id].queue[0]) {
        msg.channel.createMessage({
          embed: {
            color: 16765404,
            title: '🎵 Skip',
            description: `Now skipping **${musicUtils.servers[msg.member.guild.id].queue[0].title}**`,
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        })
        musicUtils.servers[msg.member.guild.id].connection.stopPlaying() // Stop playing the song
        logger.cmdUsage(module.exports.options.name, msg, args)
      }
    } else {
      msg.channel.createMessage('Looks like there is no song to skip') // Notify that there is no song to skip
      logger.cmdUsageError(module.exports.options.name, msg, args, 'No song to skip')
    }
  }
}
