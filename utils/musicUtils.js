/**
 * Aru
 * Music Utils
 */

let servers = []

function playMusic (bot, logger, msg, voiceChannel, ytdl) {
  servers[msg.member.guild.id].connection.play(ytdl(servers[msg.member.guild.id].queue[0].url, {filter: 'audioonly'})) // Play song
  msg.channel.createMessage({
    embed: {
      color: 16765404,
      title: '🎵 Playing',
      description: `Now playing **${servers[msg.member.guild.id].queue[0].title} [${servers[msg.member.guild.id].queue[0].length}]** requested by **${servers[msg.member.guild.id].queue[0].requester.username}#${servers[msg.member.guild.id].queue[0].requester.discriminator}**`,
      timestamp: new Date(),
      footer: {
        icon_url: bot.user.avatarURL,
        text: bot.user.username
      }
    }
  })
  logger.info(`Song ${servers[msg.member.guild.id].queue[0].title} requested by ${servers[msg.member.guild.id].queue[0].requester.username}#${servers[msg.member.guild.id].queue[0].requester.discriminator} in ${servers[msg.member.guild.id].queue[0].channel.guild.name} now playing`)

  servers[msg.member.guild.id].connection.once('end', () => {
    msg.channel.createMessage({
      embed: {
        color: 16765404,
        title: '🎵 Finished',
        description: `Finished **${servers[msg.member.guild.id].queue[0].title} [${servers[msg.member.guild.id].queue[0].length}]** requested by **${servers[msg.member.guild.id].queue[0].requester.username}#${servers[msg.member.guild.id].queue[0].requester.discriminator}**`,
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: bot.user.username
        }
      }
    })
    logger.info(`Song ${servers[msg.member.guild.id].queue[0].title} requested by ${servers[msg.member.guild.id].queue[0].requester.username}#${servers[msg.member.guild.id].queue[0].requester.discriminator} in ${servers[msg.member.guild.id].queue[0].channel.guild.name} has finished`)
    servers[msg.member.guild.id].queue.shift() // Remove from queue
    if (servers[msg.member.guild.id].queue[0]) {
      playMusic(bot, logger, msg, voiceChannel, ytdl)
    } else {
      voiceChannel.leave() // Leave voice channel
    }
  })

  servers[msg.member.guild.id].connection.once('error', err => {
    logger.error(err)
  })
}

function getInfo (bot, logger, msg, songURL, voiceChannel, ytdl) {
  // Setup files and modules
  const moment = require('moment')

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

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '🎵 Added to Queue',
          description: `**${songAdded.title} [${songAdded.length}]** requested by **${songAdded.requester.username}#${songAdded.requester.discriminator}:** has been added to queue at position #${servers[msg.member.guild.id].queue.length}`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      })
      logger.info(`Song ${songAdded.title} added to queue by ${songAdded.requester.username}#${songAdded.requester.discriminator} in ${songAdded.channel.guild.name} with song url ${songURL}`)

      if (!servers[msg.member.guild.id].queue[1]) { // Play the music if it isn't already being played
        bot.joinVoiceChannel(msg.member.voiceState.channelID) // Join the user's voice channel
          .then((connection) => {
            servers[msg.member.guild.id].connection = connection
            playMusic(bot, logger, msg, voiceChannel, ytdl)
          })
          .catch((err) => {
            bot.createMessage(songAdded.channel.id, 'Error occured joining VC: ' + err.message)
            logger.error(`FAILURE: Play command used by ${songAdded.requester.username}#${songAdded.requester.discriminator} in ${songAdded.requester.guild.name} with song url ${songURL} Error joining VC ${err}`)
          })
      }
    })
    .catch(function (err) {
      bot.createMessage(msg.channel.id, 'Error occured getting information about song: ' + err.message) // Notify of error
      logger.error(`FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with song url ${songURL} ${err} Error getting info about song`)
    })
}

module.exports = {
  servers: servers,
  playMusic: playMusic,
  getInfo: getInfo
}
