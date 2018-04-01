/**
 * Aru
 * Message Update Event
 */

// Setup files and modules
const guildModel = require('../db/models/guild.js');

module.exports = function (bot, logger, message, oldMessage) {
  if (message && oldMessage && message.channel && message.channel.guild && message.embeds && message.author && !message.author.bot && message.content && oldMessage.content && message.content !== oldMessage.content) {
    guildModel.findOne({ _id: message.channel.guild.id }, 'notifications', (err, server) => { // Query for notifications
      if (err) { return logger.error(err); } // Log error
      if (server.notifications.messageUpdateChannel) {
        message.channel.guild.channels.find((channel) => {
          if (channel.id === server.notifications.messageUpdateChannel) {
            channel.createMessage({
              embed: {
                color: 16765404,
                title: `📝 Message changed by ${message.author.username}#${message.author.discriminator} in #${message.channel.name}`,
                fields: [
                  {
                    name: 'Old Message',
                    value: oldMessage.content.substr(0, 1024)
                  },
                  {
                    name: 'New Message',
                    value: message.content.substr(0, 1024)
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: bot.user.avatarURL,
                  text: bot.user.username
                }
              }
            });
          }
        });
      }
    });
  }
};
