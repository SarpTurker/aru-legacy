/**
 * Aru
 * Anime Command
 */

module.exports = {
  options: {
    name: 'anime',
    usage: 'anime <name>',
    description: 'Responds with anime info',
    fullDescription: 'Responds with anime info. Includes episode count, length, airing dates, Kitsu rating, age rating, and synopsis.'
  },

  exec: function (bot, logger, msg, args) {
    // Setup files and modules
    const axios = require('axios');

    // Test to make sure user put in args
    if (!args[0]) {
      msg.channel.createMessage(`Please put in a anime name following \`${module.exports.options.name}\`.`);
      logger.cmdUsageError(module.exports.options.name, msg, args, 'No anime name');
      return;
    }

    axios
      .get(`https://kitsu.io/api/edge/anime?filter[text]=${args}`)
      .then(response => {
        // Create message
        msg.channel.createMessage({
          embed: {
            author: {
              name: response.data.data[0].attributes.titles.en,
              icon_url:
                'https://pbs.twimg.com/profile_images/807964865511862278/pIYOVdsl_400x400.jpg',
              url: `https://kitsu.io/anime/${response.data.data[0].attributes.slug}`
            },
            title: 'Anime Information:',
            color: 16765404,
            fields: [
              {
                name: 'Episode Count',
                value: response.data.data[0].attributes.episodeCount ? response.data.data[0].attributes.episodeCount.toString() : 'None',
                inline: true
              },
              {
                name: 'Episode Length',
                value: response.data.data[0].attributes.episodeLength ? response.data.data[0].attributes.episodeLength.toString() : 'None',
                inline: true
              },
              {
                name: 'Started Airing',
                value: response.data.data[0].attributes.startDate ? response.data.data[0].attributes.startDate : 'None',
                inline: true
              },
              {
                name: 'Finished Airing',
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

        // Log command usage
        logger.cmdUsage(module.exports.options.name, msg, args);
      })
      .catch(err => {
        // Create message
        msg.channel.createMessage(`Anime not found :slight_frown:`);

        // Log command usage
        logger.cmdUsageError(module.exports.options.name, msg, args, err);
      });
  }
};
