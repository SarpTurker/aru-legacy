/**
 * Aru
 * Ping Command
 */

module.exports = function (bot, logger) {
  bot.registerCommand('ping', (msg) => {
    // Create message
    bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** Pong! ${bot.user.username} is currently on ${bot.guilds.size} servers and serving ${bot.users.size} users.`)

    // Log command usage
    logger.info(new Date() + `: Ping command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}`)
  }, {
    guildOnly: true
  })
}
