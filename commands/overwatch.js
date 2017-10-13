/**
 * Aru
 * Overwatch Command
 */

// Setup files and modules
const axios = require('axios')

module.exports = function(bot, logger) {
  bot.registerCommand('ow', (msg, args) => {
    const Username = args[0].replace('#', '-')
    const Platform = args[1]
    const Region = args[2]
    axios
      .get(`https://ow-api.com/v1/stats/${Platform}/${Region}/${Username}/complete`)
      .then(response => {
        const embed = {
          author: {
            name: response.data.name,
            icon_url: 'https://pbs.twimg.com/profile_images/538246909664559104/oeOj9DtM.png',
            url: `http://masteroverwatch.com/profile/${Platform}/${Region}/${Username}`
          },
          title: 'Overwatch Information:',
          color: 16765404,
          fields: [
            {
              name: 'Level',
              value:
                response.data.level != null
                  ? response.data.level
                  : '0',
              inline: true
            },
            {
              name: 'Quick Wins',
              value:
                response.data.quickPlayStats.games.won != null
                  ? response.data.quickPlayStats.games.won
                  : '0',
              inline: true
            },
            {
              name: 'Competitive Wins',
              value:
                response.data.competitiveStats.games.won != null
                  ? response.data.competitiveStats.games.won
                  : '0',
              inline: true
            },
            {
              name: 'Competitive Lost',
              value:
                response.data.competitiveStats.games.played != null
                  ? response.data.competitiveStats.games.played - response.data.competitiveStats.games.won
                  : '0',
              inline: true
            },
            {
              name: 'Playtime (Quick)',
              value:
                response.data.quickPlayStats.careerStats.allHeroes.game.timePlayed != null
                  ? response.data.quickPlayStats.careerStats.allHeroes.game.timePlayed
                  : '0',
              inline: true
            },
            {
              name: 'Playtime (Competitive)',
              value:
                response.data.competitiveStats.careerStats.allHeroes.game.timePlayed != null
                  ? response.data.competitiveStats.careerStats.allHeroes.game.timePlayed
                  : '0',
              inline: true
            }
          ],
          thumbnail: {
            url:
              response.data.icon != null ? response.data.icon : ''
          },
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }

        // Create message
        bot.createMessage(msg.channel.id, {
          embed: embed
        })

        // Log command usage
        logger.info(
          new Date() +
            ': ' +
            'Overwatch command used by ' +
            msg.author.username +
            '#' +
            msg.author.discriminator +
            ' in ' +
            msg.channel.guild.name +
            ' with args ' +
            args
        )
      })
      .catch(error => {
        // Create message
        bot.createMessage(msg.channel.id, 'Overwatch profile not found :slight_frown:')
        
        // Log command usage
        logger.info(
          new Date() +
            ': ' +
            'FAILURE: Overwatch command used by ' +
            msg.author.username +
            '#' +
            msg.author.discriminator +
            ' in ' +
            msg.channel.guild.name +
            ' with args ' +
            args
        )
      })
  })
}
