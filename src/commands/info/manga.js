/**
 * Aru
 * Manga Command
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
    name: 'manga',
    usage: 'manga <name>',
    description: 'Responds with manga info',
    fullDescription: 'Responds with manga info. Includes date started, finished, Kitsu rating, age rating, synopsis.'
  },

  exec: function (bot, logger, msg, args) {
    // Test to make sure user put in args
    if (!args[0]) {
      msg.channel.createMessage(`Please put in a manga name following \`${module.exports.options.name}\`.`);
      logger.cmdUsageWarn(module.exports.options.name, msg, args, 'No manga name');
      return;
    }

    axios
      .get(`https://kitsu.io/api/edge/manga?filter[text]=${args}`)
      .then(response => {
        // Create message
        msg.channel.createMessage({
          embed: {
            author: {
              name: response.data.data[0].attributes.titles.en,
              icon_url:
                'https://pbs.twimg.com/profile_images/807964865511862278/pIYOVdsl_400x400.jpg',
              url: `https://kitsu.io/manga/${response.data.data[0].attributes.slug}`
            },
            title: 'Manga Information:',
            color: 16765404,
            fields: [
              {
                name: 'Started',
                value: response.data.data[0].attributes.startDate ? response.data.data[0].attributes.startDate : 'None',
                inline: true
              },
              {
                name: 'Finished',
                value: response.data.data[0].attributes.endDate ? response.data.data[0].attributes.endDate : 'None',
                inline: true
              },
              {
                name: 'Kitsu.io Rating',
                value: response.data.data[0].attributes.averageRating ? response.data.data[0].attributes.averageRating.toString() : 'None',
                inline: true
              },
              {
                name: 'Age Rating',
                value: response.data.data[0].attributes.ageRating ? response.data.data[0].attributes.ageRating : 'None',
                inline: true
              },
              {
                name: 'Synopsis',
                value: response.data.data[0].attributes.synopsis ? response.data.data[0].attributes.synopsis.substr(0, 1024) : 'None',
                inline: false
              }
            ],
            thumbnail: {
              url: response.data.data[0].attributes.posterImage ? response.data.data[0].attributes.posterImage.medium : ''
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
        msg.channel.createMessage(`Manga not found :slight_frown:`);
        logger.cmdUsageError(module.exports.options.name, msg, args, err);
      });
  }
};
