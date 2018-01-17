/**
 * Aru
 * Status Manager
 */

// Setup files and modules
const axios = require('axios')
const config = require('../config.json')

// Set game status on Discord
var setStatus = function setStatus (bot, logger) {
  bot.shards.forEach(shard => {
    // Check if there is a streaming url present, if so set status to streaming
    if (config.stream_url) {
      shard.editStatus({
        name: config.game_name,
        type: 1,
        url: config.stream_url
      })

      // Log status change
      logger.info(new Date() + `: Game status set to ${config.game_name} and stream url set to ${config.stream_url}`)
    } else {
      shard.editStatus({
        name: config.game_name,
        type: 0
      })

      // Log status change
      logger.info(new Date() + `: Game status set to ${config.game_name}`)
    }
  })
}

// Post status to Carbonitex and discord.pw
var postStats = function postStats (bot, logger) {
  if (config.discord_pw_key) {
    axios({
      method: 'post',
      url: 'https://bots.discord.pw/api/bots/' + bot.user.id + '/stats',
      headers: {
        'Authorization': config.discord_pw_key,
        'content-type': 'application/json'
      },
      data: {
        'server_count': bot.guilds.size
      }
    })

    // Log stat post
    logger.info(new Date() + `: Stats posted to discord.pw`)
  }

  if (config.carbonitex_key) {
    axios({
      method: 'post',
      url: 'https://www.carbonitex.net/discord/data/botdata.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        'key': config.carbonitex_key,
        'servercount': bot.guilds.size
      }
    })

    // Log stat post
    logger.info(new Date() + ': Stats posted to Carbonitex')
  }
}

module.exports = {
  setStatus: setStatus,
  postStats: postStats
}
