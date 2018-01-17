/**
 * Aru
 * About Command
 */

module.exports = function (bot, logger) {
  bot.registerCommand('about', (msg) => {
    let embed = {
      color: 16765404,
      author: {
        name: bot.user.username,
        icon_url: bot.user.avatarURL
      },
      title: 'Description:',
      description: 'Aru is a modular Discord bot powered by Eris with miscellaneous functions. Our repository can be found at https://github.com/perhion/aru',
      thumbnail: {
        url: bot.user.avatarURL
      },
      timestamp: new Date(),
      footer: {
        icon_url: bot.user.avatarURL,
        text: bot.user.username
      }
    }

    // Create message
    bot.createMessage(msg.channel.id, {
      embed: embed
    })

    // Log command usage
    logger.info(new Date() + `: Logger command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}`)
  })
}
