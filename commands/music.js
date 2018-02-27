/**
 * Aru
 * Music Command
 */

const config = require('../config.json')
const ytdl = require('ytdl-core')
const YoutubeAPI = require('simple-youtube-api')
const moment = require('moment')
const youtube = new YoutubeAPI(config.tokens.information.youtube_key)

module.exports = function (bot, logger) {
  let servers = {}

  let playMusic = (msg, voiceChannel) => {
    servers[msg.member.guild.id].connection.play(ytdl(servers[msg.member.guild.id].queue[0].url, {filter: 'audioonly'})) // Play song
    bot.createMessage(servers[msg.member.guild.id].queue[0].channel.id, `**${servers[msg.member.guild.id].queue[0].requester.username}#${servers[msg.member.guild.id].queue[0].requester.discriminator}:** Now playing **${servers[msg.member.guild.id].queue[0].title} [${servers[msg.member.guild.id].queue[0].length}]**`)
    logger.info(new Date() + `: Song ${servers[msg.member.guild.id].queue[0].title} requested by ${servers[msg.member.guild.id].queue[0].requester.username}#${servers[msg.member.guild.id].queue[0].requester.discriminator} in ${servers[msg.member.guild.id].queue[0].channel.guild.name} now playing`)

    servers[msg.member.guild.id].connection.once('end', () => {
      bot.createMessage(servers[msg.member.guild.id].queue[0].channel.id, `**${servers[msg.member.guild.id].queue[0].requester.username}#${servers[msg.member.guild.id].queue[0].requester.discriminator}:** Finished **${servers[msg.member.guild.id].queue[0].title}**`)
      logger.info(new Date() + `: Song ${servers[msg.member.guild.id].queue[0].title} requested by ${servers[msg.member.guild.id].queue[0].requester.username}#${servers[msg.member.guild.id].queue[0].requester.discriminator} in ${servers[msg.member.guild.id].queue[0].channel.guild.name} has finished`)
      servers[msg.member.guild.id].queue.shift() // Remove from queue
      if (servers[msg.member.guild.id].queue[0]) {
        playMusic(msg, voiceChannel)
      } else {
        voiceChannel.leave() // Leave voice channel
      }
    })

    servers[msg.member.guild.id].connection.once('error', error => {
      bot.createMessage(servers[msg.member.guild.id].queue[0].channel.id, `An error has occured ${error}. Please try replaying the song again.`)
      logger.info(new Date() + `: FAILURE: Song ${servers[msg.member.guild.id].queue[0].title} requested by ${servers[msg.member.guild.id].queue[0].requester.username}#${servers[msg.member.guild.id].queue[0].requester.discriminator} in ${servers[msg.member.guild.id].queue[0].channel.guild.name} error ${error}`)
    })
  }

  let getInfo = (msg, songURL, voiceChannel) => {
    if (!servers[msg.member.guild.id]) { // Create server and queue if it doesn't exist
      servers[msg.member.guild.id] = {
        queue: []
      }
    }

    ytdl.getInfo(songURL, {downloadURL: true}) // Get info about song
      .then(function (info) {
        let song = { // Template for song
          title: info.title,
          length: moment.utc(info.length_seconds * 1000).format('HH:mm:ss'),
          requester: msg.author,
          channel: msg.channel,
          url: songURL
        }
        servers[msg.member.guild.id].queue.push(song) // Push to queue

        let songAdded = servers[msg.member.guild.id].queue[servers[msg.member.guild.id].queue.length - 1]

        bot.createMessage(songAdded.channel.id, `**${songAdded.requester.username}#${songAdded.requester.discriminator}: ${songAdded.title}** has been added to queue at position #${servers[msg.member.guild.id].queue.length}`)
        logger.info(new Date() + `: Song ${songAdded.title} added to queue by ${songAdded.requester.username}#${songAdded.requester.discriminator} in ${songAdded.channel.guild.name} with song url ${songURL}`)

        if (!servers[msg.member.guild.id].queue[1]) { // Play the music if it isn't already being played
          bot.joinVoiceChannel(msg.member.voiceState.channelID) // Join the user's voice channel
            .then((connection) => {
              servers[msg.member.guild.id].connection = connection
              playMusic(msg, voiceChannel)
            })
            .catch((error) => {
              bot.createMessage(songAdded.channel.id, 'Error occured joining VC: ' + error.message)
              logger.info(new Date() + `: FAILURE: Play command used by ${songAdded.requester.username}#${songAdded.requester.discriminator} in ${songAdded.requester.guild.name} with song url ${songURL} Error joining VC`)
            })
        }
      })
      .catch(function (error) {
        bot.createMessage(msg.channel.id, 'Error occured getting information about song: ' + error.message) // Notify of error
        logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with song url ${songURL} ${error} Error getting info about song`)
      })
  }

  bot.registerCommand('play', (msg, args) => {
    let voiceChannel = msg.member.guild.channels.get(msg.member.voiceState.channelID)
    let songURL = args[0]

    if (!msg.member.voiceState.channelID) { // Test to see if user is not in voice channel
      bot.createMessage(msg.channel.id, 'Please join a voice channel before playing a song!')
      logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} Not in voice channel`)
      return
    }

    if (!voiceChannel.permissionsOf(bot.user.id).has('voiceConnect')) { // Test to see if bot has permission to join voice channel
      bot.createMessage(msg.channel.id, 'Bot does not have the permission to connect to the voice channel.')
      logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} Bot does not have connect permission`)
      return
    }

    if (!voiceChannel.permissionsOf(bot.user.id).has('voiceSpeak')) { // Test to see if bot has permission to speak in voice channel
      bot.createMessage(msg.channel.id, 'Bot does not have the permission to speak in the voice channel.')
      logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} Bot does not have speak permission`)
      return
    }

    if (songURL === 'search') { // Search for song
      if (!config.tokens.information.youtube_key) { // See if Youtube API key is present
        bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** Youtube API key is missing. Please contact bot maintainer.`)
        logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} No Youtube API Key`)
        return
      }

      let searchQuery = ''
      logger.info(new Date() + `: Searching - Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args}`)
      for (let i = 1; i < args.length; i++) {
        searchQuery += args[i] + ' '
      }
      youtube.searchVideos(searchQuery, 1)
        .then(results => {
          logger.info(new Date() + `: Searching - song selected ${results[0].title} Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args}`)
          songURL = results[0].url
          getInfo(msg, songURL, voiceChannel)
        })
        .catch(function (error) {
          bot.createMessage(msg.channel.id, 'Error searching for song: ' + error.message) // Notify of error
          logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} ${error} Error searching for song`)
        })
    } else if (ytdl.validateURL(songURL)) { // Test to see if URL is valid
      getInfo(msg, songURL, voiceChannel)
    } else {
      bot.createMessage(msg.channel.id, 'Please put in a valid YouTube URL after the command or use the search function to find a song.')
      logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} Non-valid URL`)
    }
  }, {
    guildOnly: true
  })

  bot.registerCommand('skip', (msg) => {
    if (servers[msg.member.guild.id]) { // Test to see if bot is in a connection
      if (servers[msg.member.guild.id].queue[0]) {
        bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** Now skipping **${servers[msg.member.guild.id].queue[0].title}**`) // Notify that song is being skipped
        servers[msg.member.guild.id].connection.stopPlaying() // Stop playing the song
        logger.info(new Date() + `: Skip command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}`)
      }
    } else {
      bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** Looks like there is no song to skip`) // Notify that there is no song to skip
      logger.info(new Date() + `: FAILURE: Skip command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}`)
    }
  }, {
    guildOnly: true
  })

  bot.registerCommand('queue', (msg) => {
    if (servers[msg.member.guild.id]) { // Test to see if there is a song in queue
      if (servers[msg.member.guild.id].queue[0]) {
        let queue = '**Songs presently in Queue:**\n'

        for (let i = 0; i < servers[msg.member.guild.id].queue.length; i++) {
          queue += `**${i + 1}. ${servers[msg.member.guild.id].queue[i].title} [${servers[msg.member.guild.id].queue[i].length}]** requested by **${servers[msg.member.guild.id].queue[i].requester.username}#${servers[msg.member.guild.id].queue[i].requester.discriminator}**\n` // Print songs in queue
        }

        bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:**\n${queue}`)
        logger.info(new Date() + `: Queue command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}`)
      }
    } else {
      bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** Looks like there is no song in the queue`) // Notify that there is no song in the queue
      logger.info(new Date() + `: FAILURE: Queue command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}`)
    }
  }, {
    guildOnly: true
  })
}
