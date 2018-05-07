/**
 * Aru
 * Overwatch Command
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
    name: 'ow',
    usage: 'ow <username> <platform> <region>',
    description: 'Get information from an Overwatch profile',
    fullDescription: 'Get information from an Overwatch profile. Information includes level, wins, and playtime.'
  },

  exec: function (bot, logger, msg, args) {
    if (args[1] !== 'pc' && args[1] !== 'xbl' && args[1] !== 'psn') {
      msg.channel.createMessage(`Please put in a valid platform: pc, xbl, psn.`);
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Invalid platform');
      return;
    }

    if (args[2] !== 'eu' && args[2] !== 'kr' && args[2] !== 'us' && args[2] !== 'global' && args[2] !== 'cn') {
      msg.channel.createMessage(`Please put in a valid region: eu, kr, us, global, cn.`);
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Invalid region');
      return;
    }

    let username = args[0].replace('#', '-');
    let platform = args[1];
    let region = args[2];

    axios
      .get(`https://ow-api.com/v1/stats/${platform}/${region}/${username}/complete`)
      .then(response => {
        // Create message
        msg.channel.createMessage({
          embed: {
            author: {
              name: response.data.name,
              icon_url: 'https://pbs.twimg.com/profile_images/538246909664559104/oeOj9DtM.png',
              url: `http://masteroverwatch.com/profile/${platform}/${region}/${username}`
            },
            title: 'Overwatch Information:',
            color: 16765404,
            fields: [
              {
                name: 'Level',
                value: response.data.level ? response.data.level : '0',
                inline: true
              },
              {
                name: 'Quick Wins',
                value: response.data.quickPlayStats.games.won ? response.data.quickPlayStats.games.won : '0',
                inline: true
              },
              {
                name: 'Competitive Wins',
                value: response.data.competitiveStats.games.won ? response.data.competitiveStats.games.won : '0',
                inline: true
              },
              {
                name: 'Competitive Lost',
                value: response.data.competitiveStats.games.played ? response.data.competitiveStats.games.played - response.data.competitiveStats.games.won : '0',
                inline: true
              },
              {
                name: 'Playtime (Quick)',
                value: response.data.quickPlayStats.careerStats.allHeroes.game.timePlayed ? response.data.quickPlayStats.careerStats.allHeroes.game.timePlayed : '0',
                inline: true
              },
              {
                name: 'Playtime (Competitive)',
                value: response.data.competitiveStats.careerStats.allHeroes.game.timePlayed ? response.data.competitiveStats.careerStats.allHeroes.game.timePlayed : '0',
                inline: true
              }
            ],
            thumbnail: {
              url:
                response.data.icon ? response.data.icon : ''
            },
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });

        logger.cmdUsage(module.exports.options.name, msg, args);
      })
      .catch(err => {
        msg.channel.createMessage(`Overwatch profile :slight_frown:`);
        logger.cmdUsageError(module.exports.options.name, msg, args, err);
      });
  }
};
