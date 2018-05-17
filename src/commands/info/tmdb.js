/**
 * Aru
 * TMDb Command
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
    name: 'movie',
    usage: 'movie <name>',
    description: 'Responds with movie info',
    fullDescription: 'Responds with movie info. Includes release date, vote average, status, runtime, genre, production company, runtime, language, plot.'
  },

  exec: (bot, logger, msg, args) => {
    // Test to make sure user put in args
    if (!args[0]) {
      msg.channel.createMessage(`Please put in a movie name following \`${module.exports.options.name}\`.`);
      logger.cmdUsageWarn(module.exports.options.name, msg, args, 'No movie name');
      return;
    }

    axios
      .get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&query=${args}`)
      .then(response => {
        axios
          .get(`https://api.themoviedb.org/3/movie/${response.data.results[0].id}?api_key=${process.env.TMDB_KEY}&language=en-US`)
          .then(response => {
            msg.channel.createMessage({
              embed: {
                author: {
                  name: response.data.original_title,
                  icon_url: 'https://www.themoviedb.org/assets/static_cache/2dceae11589334eecd61443249261daf/images/v4/logos/208x226-stacked-green.png',
                  url: response.data.homepage ? response.data.homepage : ''
                },
                title: 'Movie Information:',
                color: 16765404,
                fields: [
                  {
                    name: 'Release Date',
                    value: response.data.release_date ? response.data.release_date : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Vote Average',
                    value: response.data.vote_average.toString() ? response.data.vote_average.toString() : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Status',
                    value: response.data.status ? response.data.status : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Runtime',
                    value: response.data.runtime.toString() ? response.data.runtime.toString() + ' min' : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Genre',
                    value: response.data.genres[0].name ? response.data.genres[0].name : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Production Company',
                    value: response.data.production_companies[0].name ? response.data.production_companies[0].name : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Language',
                    value: response.data.original_language ? response.data.original_language : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Country',
                    value: response.data.production_countries[0].name ? response.data.production_countries[0].name : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Plot',
                    value: response.data.overview ? response.data.overview.substr(0, 1024) : 'N/A',
                    inline: false
                  }
                ],
                thumbnail: {
                  url: response.data.poster_path ? 'https://image.tmdb.org/t/p/w500' + response.data.poster_path : 'https://www.themoviedb.org/assets/static_cache/2dceae11589334eecd61443249261daf/images/v4/logos/208x226-stacked-green.png'
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
            msg.channel.createMessage(`An error occured while finding info on movie :slight_frown:.`);
            logger.cmdUsageWarn(module.exports.options.name, msg, args, err);
          });
      })
      .catch(err => {
        msg.channel.createMessage(`Movie not found :slight_frown:.`);
        logger.cmdUsageWarn(module.exports.options.name, msg, args, err);
      });
  }
};
