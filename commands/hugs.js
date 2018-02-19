/**
 * Aru
 * Hugs Command
 */

module.exports = function (bot, logger) {
  bot.registerCommand('hug', (msg) => {
    if (!msg.mentions.length) {
      bot.createMessage(msg.channel.id, bot.user.username + ' gives ' + msg.author.mention + ' a soft hug')
      logger.info(new Date() + `: Hug command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} on self`) // Log command usage
    } else {
      let users = []
      for (let i = 0; i < msg.mentions.length; i++) {
        let user = msg.channel.guild.members.get(msg.mentions[i].id).id
        users.push(`<@${user}>`)
      }
      bot.createMessage(msg.channel.id, msg.author.mention + ' hugged ' + users)
      logger.info(new Date() + `: Hug command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} on ${users}`) // Log command usage
    }
  }, {
    guildOnly: true
  })
}
