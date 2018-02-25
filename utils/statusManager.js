/**
 * Aru
 * Status Manager
 */

// Setup files and modules
const axios = require('axios')
const config = require('../config.json')

// Set game status on Discord
const setStatus = (bot, logger) => {
  bot.shards.forEach(shard => {
    // Check if there is a streaming url present, if so set status to streaming
    if (config.stream_url) {
      shard.editStatus({
        name: config.game_info.game_name,
        type: 1,
        url: config.game_info.stream_url
      })

      // Log status change
      logger.info(new Date() + `: Game status set to ${config.game_info.game_name} and stream url set to ${config.game_info.stream_url}`)
    } else {
      shard.editStatus({
        name: config.game_info.game_name,
        type: 0
      })

      // Log status change
      logger.info(new Date() + `: Game status set to ${config.game_info.game_name}`)
    }
  })
}

// Post status to Carbonitex and discord.pw
const postStats = (bot, logger) => {
  if (config.tokens.botlist_sites.discord_pw_key) {
    axios({
      method: 'post',
      url: 'https://bots.discord.pw/api/bots/' + bot.user.id + '/stats',
      headers: {
        'Authorization': config.tokens.botlist_sites.discord_pw_key,
        'content-type': 'application/json'
      },
      data: {
        'server_count': bot.guilds.size
      }
    })
      .then(() => {
        logger.info(new Date() + ': Stats posted to discord.pw')
      })
      .catch(error => {
        logger.info(new Date() + ': FAILURE: Stats not posted to discord.pw ' + error)
      })
  }

  if (config.tokens.botlist_sites.carbonitex_key) {
    axios({
      method: 'post',
      url: 'https://www.carbonitex.net/discord/data/botdata.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        'key': config.tokens.botlist_sites.carbonitex_key,
        'servercount': bot.guilds.size
      }
    })
      .then(() => {
        logger.info(new Date() + ': Stats posted to Carbonitex')
      })
      .catch(error => {
        logger.info(new Date() + ': FAILURE: Stats not posted to Carbonitex ' + error)
      })
  }

  if (config.tokens.botlist_sites.discordbots_key && config.tokens.botlist_sites.discordbots_id) {
    axios({
      method: 'post',
      url: `https://discordbots.org/api/bots/${config.tokens.botlist_sites.discordbots_id}/stats`,
      headers: {
        'content-type': 'application/json',
        'Authorization': config.tokens.botlist_sites.discordbots_key
      },
      data: {
        'server_count': bot.guilds.size
      }
    })
      .then(() => {
        logger.info(new Date() + ': Stats posted to discordbots.org')
      })
      .catch(error => {
        logger.info(new Date() + ': FAILURE: Stats not posted to discordbots.org ' + error)
      })
  }
}

module.exports = {
  setStatus: setStatus,
  postStats: postStats
}
