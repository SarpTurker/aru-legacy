/**
 * Aru
 * Server Info Command
 */

module.exports = {
  options: {
    name: 'serverinfo',
    usage: 'serverinfo',
    description: 'Responds with info about the server',
    fullDescription: 'Responds with info about the server.',
    guildOnly: true
  },

  exec: function (bot, logger, msg, args) {
    // Setup files and modules
    const config = require('../../config.json');
    const moment = require('moment');

    msg.channel.createMessage({
      embed: {
        author: {
          name: msg.channel.guild.name,
          icon_url: msg.channel.guild.iconURL,
          url: msg.channel.guild.iconURL
        },
        title: 'Server Information:',
        color: 16765404,
        fields: [
          {
            name: 'ID',
            value: msg.channel.guild.id,
            inline: true
          },
          {
            name: 'Member Count',
            value: msg.channel.guild.memberCount,
            inline: true
          },
          {
            name: 'Verification Level',
            value: msg.channel.guild.verificationLevel,
            inline: true
          },
          {
            name: 'Creation Date',
            value: `${moment(msg.channel.guild.createdAt).utc().format(config.timeFormat)} ${moment(msg.channel.guild.createdAt).fromNow()}`,
            inline: true
          },
          {
            name: 'AFK Channel ID',
            value: msg.channel.guild.afkChannelID !== null ? msg.channel.guild.afkChannelID : 'None',
            inline: true
          },
          {
            name: 'Region',
            value: msg.channel.guild.region,
            inline: true
          }
        ],
        thumbnail: {
          url: msg.channel.guild.iconURL
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
