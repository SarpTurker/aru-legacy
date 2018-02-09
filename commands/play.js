/**
 * Aru
 * Play Command
 */

const ytdl = require('ytdl-core')
const moment = require('moment')

module.exports = function (bot, logger) {
  bot.registerCommand('play', (msg, args) => {
    let voiceChannel = msg.member.guild.channels.get(msg.member.voiceState.channelID)

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

    if (!ytdl.validateURL(args[0])) { // Test to see if URL was not specified
      bot.createMessage(msg.channel.id, 'Please put in a valid YouTube URL after the command.')
      logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} Non-valid URL`)
      return
    }

    bot.joinVoiceChannel(msg.member.voiceState.channelID)
      .catch((error) => { // Join the user's voice channel
        bot.createMessage(msg.channel.id, 'Error occured joining VC: ' + error.message) // Notify of error
        logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} Error joining VC`) // Log error
      })
      .then((connection) => {
        if (connection.playing) { // Stop playing if currently playing
          bot.createMessage(msg.channel.id, 'A song is currently playing. Please run the stop command before playing a new song. Functionality will change after a queue has been added.')
          logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} Song currently playing`)
        } else {
          ytdl.getInfo(args[0], {downloadURL: true}) // Get info about song
          .then(function (info) {
            connection.play(ytdl(args[0], {filter: 'audioonly'})) // Play song
            logger.info(new Date() + `: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args}`)
            bot.createMessage(msg.channel.id, `Now playing **${info.title} [${moment.utc(info.length_seconds * 1000).format('HH:mm:ss')}]**`)
            connection.once('end', () => {
              voiceChannel.leave() // Leave voice channel
              bot.createMessage(msg.channel.id, `Finished **${info.title} [${moment.utc(info.length_seconds * 1000).format('HH:mm:ss')}]**`)
            })
          })
          .catch(function (error) {
            bot.createMessage(msg.channel.id, 'Error occured getting information about song: ' + error.message) // Notify of error
            logger.info(new Date() + `: FAILURE: Play command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} ${error}`) // Log error
          })
        }
      })
  })
}
