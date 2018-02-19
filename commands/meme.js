/**
 * Aru
 * Meme Command
 */

module.exports = function (bot, logger) {
  bot.registerCommand('meme', (msg, args) => {
    let [topword, bottomword, url] = args
    bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** https://memegen.link/custom/${topword}/${bottomword}.jpg?alt=${url}?font=impact`)

    // Log command usage
    logger.info(new Date() + `: Meme command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}`)
  }, {
    guildOnly: true
  })
}
