/**
 * Aru
 * Profile Command
 */

module.exports = {
  options: {
    name: 'profile',
    usage: 'profile <@mention>',
    description: 'Responds with user\'s Discord profie of user or of user mentioned',
    fullDescription: 'Responds with user\'s Discord profile. If mentioning another user it will respond with that user\'s Discord profile. Contains nickname, game currently playing, server join date, status, and account creation date.'
  },

  exec: function (bot, logger, msg, args) {
    // Setup files and modules
    const config = require('../../config.json');
    const moment = require('moment');

    let user;
    if (msg.mentions.length === 0) { // Use mentioned user or if none use mesage's author
      user = msg.channel.guild.members.get(msg.author.id);
    } else {
      user = msg.channel.guild.members.get(msg.mentions[0].id);
    }

    msg.channel.createMessage({
      embed: {
        author: {
          name: `${user.user.username}#${user.user.discriminator}`,
          icon_url: user.user.avatarURL,
          url: user.user.avatarURL
        },
        title: 'User Information:',
        color: 16765404,
        fields: [
          {
            name: 'Nickname',
            value: user.nick !== null ? user.nick : 'None',
            inline: true
          },
          {
            name: 'Playing',
            value: user.game !== null ? user.game.name : 'Currently not Playing',
            inline: true
          },
          {
            name: 'Join Date',
            value: `${moment(user.joinedAt).utc().format(config.time_format)} ${moment(user.joinedAt).fromNow()}`,
            inline: true
          },
          {
            name: 'User ID',
            value: user.id,
            inline: true
          },
          {
            name: 'Status',
            value: user.status,
            inline: true
          },
          {
            name: 'Creation Date',
            value: `${moment(user.user.createdAt).utc().format(config.time_format)} ${moment(user.user.createdAt).fromNow()}`,
            inline: true
          }
        ],
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
