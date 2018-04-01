/**
 * Aru
 * About Command
 */

module.exports = {
  options: {
    name: 'about',
    usage: 'about',
    description: 'Responds with bot info',
    fullDescription: 'Responds with bot info.'
  },

  exec: function (bot, logger, msg, args) {
    msg.channel.createMessage({
      embed: {
        color: 16765404,
        title: 'Description',
        description: 'Aru is a modular Discord bot powered by Eris with miscellaneous functions.\n\n**Github**: https://github.com/perhion/aru\n**Site**: https://perhion.com/aru',
        thumbnail: {
          url: bot.user.avatarURL
        },
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: bot.user.username
        }
      }
    });

    logger.cmdUsage(module.exports.options.name, msg, args);
  }
};
