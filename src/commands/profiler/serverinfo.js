/**
 * Aru
 * Server Info Command
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
    name: 'serverinfo',
    usage: 'serverinfo',
    description: 'Responds with info about the server',
    fullDescription: 'Responds with info about the server.',
    guildOnly: true
  },

  exec: (bot, logger, msg, args) => {
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
            value: `${moment(msg.channel.guild.createdAt).utc().format(process.env.TIME_FORMAT)} ${moment(msg.channel.guild.createdAt).fromNow()}`,
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
