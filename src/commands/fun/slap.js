/**
 * Aru
 * Slap Command
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
const axios = require('axios');

module.exports = {
  options: {
    name: 'slap',
    usage: 'slap <@mention>',
    description: 'Slaps the user or mentioned users',
    fullDescription: 'Slaps the user or mentioned users.'
  },

  exec: (bot, logger, msg, args) => {
    // Make GET request to get url for hug img
    axios
      .get(`https://nekos.life/api/v2/img/slap`)
      .then(response => {
        if (!msg.mentions.length) { // If user did not mention anyone give them a hug
          // Create message
          msg.channel.createMessage({
            embed: {
              color: 16765404,
              description: `**${bot.user.username}** slapped ${msg.author.mention}`,
              image: {
                url: response.data.url
              },
              timestamp: new Date(),
              footer: {
                text: 'Using nekos.life'
              }
            }
          });
        } else {
          let users = [];
          for (let i = 0; i < msg.mentions.length; i++) {
            let user = msg.channel.guild.members.get(msg.mentions[i].id).id;
            users.push(`<@${user}>`);
          }
          // Create message
          msg.channel.createMessage({
            embed: {
              color: 16765404,
              description: `**${msg.author.username}${msg.author.discriminator}** slapped ${users.join(' ')}`,
              image: {
                url: response.data.url
              },
              timestamp: new Date(),
              footer: {
                text: 'Using nekos.life'
              }
            }
          });
        }
        logger.cmdUsage(module.exports.options.name, msg, args);
      });
  }
};
