/**
 * Aru
 * Profile Command
 * Copyright (C) 2018 - Present, PyroclasticMayhem
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

// Import dependencies
const moment = require('moment');

module.exports = {
  options: {
    name: 'profile',
    usage: 'profile <@mention>',
    description: 'Responds with user\'s Discord profie of user or of user mentioned',
    fullDescription: 'Responds with user\'s Discord profile. If mentioning another user it will respond with that user\'s Discord profile. Contains nickname, game currently playing, server join date, status, and account creation date.'
  },

  exec: (bot, logger, msg, args) => {
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
            value: `${moment(user.joinedAt).utc().format(process.env.TIME_FORMAT)} ${moment(user.joinedAt).fromNow()}`,
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
            value: `${moment(user.user.createdAt).utc().format(process.env.TIME_FORMAT)} ${moment(user.user.createdAt).fromNow()}`,
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
