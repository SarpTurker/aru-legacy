/**
 * Aru
 * Hug Command
 */

module.exports = {
  options: {
    name: 'hug',
    usage: 'hug <@mention>',
    description: 'Gives the user or mentioned users a hug',
    fullDescription: 'Gives the user or mentioned users a hug.'
  },

  exec: function (bot, logger, msg, args) {
    if (!msg.mentions.length) {
      bot.createMessage(msg.channel.id, bot.user.username + ' gives ' + msg.author.mention + ' a soft hug');
    } else {
      let users = [];
      for (let i = 0; i < msg.mentions.length; i++) {
        let user = msg.channel.guild.members.get(msg.mentions[i].id).id;
        users.push(`<@${user}>`);
      }
      bot.createMessage(msg.channel.id, msg.author.mention + ' hugged ' + users);
    }
    logger.cmdUsage(module.exports.options.name, msg, args);
  }
};
