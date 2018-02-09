/**
 * Aru
 * Skip Command
 */

module.exports = function (bot, logger) {
  bot.registerCommand('skip', (msg) => {
    let voiceChannel = msg.member.guild.channels.get(msg.member.voiceState.channelID)

    if (!msg.member.voiceState.channelID) { // Test to see if user is not in voice channel
      bot.createMessage(msg.channel.id, 'Please join a voice channel before skipping a song!')
      logger.info(new Date() + `: FAILURE: Skip command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} Not in voice channel`) // Log error
    } else {
      voiceChannel.leave() // Leave voice channel
      logger.info(new Date() + `: Skip command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}`) // Log error
    }
  })
}
