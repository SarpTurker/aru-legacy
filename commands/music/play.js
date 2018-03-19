/**
 * Aru
 * Play Command
 */

module.exports = {
  options: {
    name: 'play',
    usage: 'play <url> or play search <song name>',
    description: 'Play a song from url or name through YouTube',
    fullDescription: 'Play a song from url or name through YouTube.',
    guildOnly: true
  },

  exec: function (bot, logger, msg, args) {
    const musicUtils = require('../../utils/musicUtils.js')
    const config = require('../../config.json')
    const ytdl = require('ytdl-core')
    const YoutubeAPI = require('simple-youtube-api')
    const youtube = new YoutubeAPI(config.tokens.information.youtube_key)
    let voiceChannel = msg.member.guild.channels.get(msg.member.voiceState.channelID)
    let songURL = args[0]

    if (!msg.member.voiceState.channelID) { // Test to see if user is not in voice channel
      bot.createMessage(msg.channel.id, 'Please join a voice channel before playing a song!')
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Not in voice channel')
      return
    }

    if (!voiceChannel.permissionsOf(bot.user.id).has('voiceConnect')) { // Test to see if bot has permission to join voice channel
      bot.createMessage(msg.channel.id, 'Bot does not have the permission to connect to the voice channel.')
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Bot does not have connect permission')
      return
    }

    if (!voiceChannel.permissionsOf(bot.user.id).has('voiceSpeak')) { // Test to see if bot has permission to speak in voice channel
      bot.createMessage(msg.channel.id, 'Bot does not have the permission to speak in the voice channel.')
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Bot does not have speak permission')
      return
    }

    if (!args[0]) { // Test to make sure user put in args
      msg.channel.createMessage('Please put in a valid YouTube URL after the command or use the search function to find a song.')
      logger.cmdUsageError(module.exports.options.name, msg, args, 'No URL')
      return
    }

    if (songURL === 'search') { // Search for song
      if (!config.tokens.information.youtube_key) { // See if Youtube API key is present
        bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** Youtube API key is missing. Please contact bot maintainer.`)
        logger.cmdUsageError(module.exports.options.name, msg, args, 'No Youtube API Key')
        return
      }

      let searchQuery = ''
      for (let i = 1; i < args.length; i++) {
        searchQuery += args[i] + ' '
      }
      youtube.searchVideos(searchQuery, 1)
        .then(results => {
          logger.cmdUsage(module.exports.options.name, msg, `${args} and searching songs`)
          songURL = results[0].url
          musicUtils.getInfo(bot, logger, msg, songURL, voiceChannel, ytdl)
        })
        .catch(function (err) {
          bot.createMessage(msg.channel.id, 'Error searching for song: ' + err.message) // Notify of error
          logger.cmdUsageError(module.exports.options.name, msg, args, err)
        })
    } else if (ytdl.validateURL(songURL)) { // Test to see if URL is valid
      musicUtils.getInfo(bot, logger, msg, songURL, voiceChannel, ytdl)
    } else {
      bot.createMessage(msg.channel.id, 'Please put in a valid YouTube URL after the command or use the search function to find a song.')
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Non Valid URL')
    }
  }
}
