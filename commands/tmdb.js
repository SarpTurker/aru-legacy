/**
 * Aru
 * TMDb Command
 */

// Setup files and modules
const config = require('../config.json')
const axios = require('axios')

module.exports = function (bot, logger) {
  bot.registerCommand('movie', (msg, args) => {
    if (!config.tmdb_key) { // See if TMDb API key is present
      bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** TMDb API key is missing. Please contact bot maintainer.`)
      logger.info(new Date() + `: FAILURE: TMDb command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} No API Key`)
      return
    }

    axios
      .get(`https://api.themoviedb.org/3/search/movie?api_key=${config.tmdb_key}&query=${args}`)
      .then(response => {
        axios
            .get(`https://api.themoviedb.org/3/movie/${response.data.results[0].id}?api_key=${config.tmdb_key}&language=en-US`)
            .then(response => {
              let embed = {
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
                    value: response.data.overview !== null ? response.data.overview : 'N/A',
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
              bot.createMessage(msg.channel.id, {embed: embed})

              // Log command usage
              logger.info(new Date() + `: TMDb command used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args}`)
            })
            .catch(error => {
              // Create message
              bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** An error occured while finding info on movie :slight_frown:`)

              // Log command usage
              logger.info(new Date() + `: FAILURE: TMDb command (Info Query) used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} ID: ${response.data.results[0].id} and error ${error}`)
            })
      })
      .catch(error => {
        // Create message
        bot.createMessage(msg.channel.id, `**${msg.author.username}#${msg.author.discriminator}:** + Movie not found :slight_frown:`)

        // Log command usage
        logger.info(new Date() + `: FAILURE: TMDb command (ID Find) used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name} with args ${args} and error ${error}`)
      })
  }, {
    guildOnly: true
  })
}
