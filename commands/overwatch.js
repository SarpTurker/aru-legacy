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
      .get(`https://api.lootbox.eu/${Platform}/${Region}/${Username}/profile`)
      .then(response => {
        const embed = {
          author: {
            name: response.data.data.username,
            icon_url: 'https://pbs.twimg.com/profile_images/538246909664559104/oeOj9DtM.png',
            url: `http://masteroverwatch.com/profile/${Platform}/${Region}/${Username}`
          },
          title: 'Overwatch Information:',
          color: 16765404,
          fields: [
            {
              name: 'Level',
              value:
                response.data.data.level != null
                  ? response.data.data.level
                  : '0',
              inline: true
            },
            {
              name: 'Quick Wins',
              value:
                response.data.data.games.quick.wins != null
                  ? response.data.data.games.quick.wins
                  : '0',
              inline: true
            },
            {
              name: 'Competitive Wins',
              value:
                response.data.data.competitive.wins != null
                  ? response.data.data.competitive.wins
                  : '0',
              inline: true
            },
            {
              name: 'Competitive Lost',
              value:
                response.data.data.competitive.lost != null
                  ? response.data.data.competitive.lost
                  : '0',
              inline: true
            },
            {
              name: 'Playtime (Quick)',
              value:
                response.data.data.playtime.quick != null
                  ? response.data.data.playtime.quick
                  : '0',
              inline: true
            },
            {
              name: 'Playtime (Competitive)',
              value:
                response.data.data.playtime.competitive != null
                  ? response.data.data.playtime.competitive
                  : '0',
              inline: true
            }
          ],
          thumbnail: {
            url:
              response.data.data.avatar != null ? response.data.data.avatar : ''
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
