/**
 * Aru
 * TMDb Command
 */

module.exports = {
  options: {
    name: 'movie',
    usage: 'movie <name>',
    description: 'Responds with movie info',
    fullDescription: 'Responds with movie info. Includes release date, vote average, status, runtime, genre, production company, runtime, language, plot.'
  },

  exec: function (bot, logger, msg, args) {
    // Setup files and modules
    const config = require('../../config.json')
    const axios = require('axios')

    if (!config.tokens.information.tmdb_key) { // See if TMDb API key is present
      msg.channel.createMessage(`TMDb API key is missing. Please contact bot maintainer.`)
      logger.cmdUsageError(module.exports.options.name, msg, args, 'No TMDb API key')
      return
    }

    axios
      .get(`https://api.themoviedb.org/3/search/movie?api_key=${config.tokens.information.tmdb_key}&query=${args}`)
      .then(response => {
        axios
          .get(`https://api.themoviedb.org/3/movie/${response.data.results[0].id}?api_key=${config.tokens.information.tmdb_key}&language=en-US`)
          .then(response => {
            msg.channel.createMessage({
              embed: {
                author: {
                  name: response.data.original_title,
                  icon_url: 'https://www.themoviedb.org/assets/static_cache/2dceae11589334eecd61443249261daf/images/v4/logos/208x226-stacked-green.png',
                  url: response.data.homepage !== null ? response.data.homepage : ''
                },
                title: 'Movie Information:',
                color: 16765404,
                fields: [
                  {
                    name: 'Release Date',
                    value: response.data.release_date !== null ? response.data.release_date : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Vote Average',
                    value: response.data.vote_average.toString() !== null ? response.data.vote_average.toString() : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Status',
                    value: response.data.status !== null ? response.data.status : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Runtime',
                    value: response.data.runtime.toString() !== null ? response.data.runtime.toString() + ' min' : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Genre',
                    value: response.data.genres[0].name !== null ? response.data.genres[0].name : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Production Company',
                    value: response.data.production_companies[0].name !== null ? response.data.production_companies[0].name : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Language',
                    value: response.data.original_language !== null ? response.data.original_language : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Country',
                    value: response.data.production_countries[0].name !== null ? response.data.production_countries[0].name : 'N/A',
                    inline: true
                  },
                  {
                    name: 'Plot',
                    value: response.data.overview !== null ? response.data.overview.substr(0, 1024) : 'N/A',
                    inline: false
                  }
                ],
                thumbnail: {
                  url: response.data.poster_path !== null ? 'https://image.tmdb.org/t/p/w500' + response.data.poster_path : 'https://www.themoviedb.org/assets/static_cache/2dceae11589334eecd61443249261daf/images/v4/logos/208x226-stacked-green.png'
                },
                timestamp: new Date(),
                footer: {
                  icon_url: bot.user.avatarURL,
                  text: bot.user.username
                }
              }
            })

            logger.cmdUsage(module.module.exports.options.name, msg, args)
          })
          .catch(err => {
            msg.channel.createMessage(`An error occured while finding info on movie :slight_frown:.`)
            logger.cmdUsageError(module.module.exports.options.name, msg, args, err)
          })
      })
      .catch(err => {
        msg.channel.createMessage(`Movie not found :slight_frown:.`)
        logger.cmdUsageError(module.module.exports.options.name, msg, args, err)
      })
  }
}
