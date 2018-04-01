/**
 * Aru
 * Status Manager
 */

// Setup files and modules
const axios = require('axios');
const config = require('../config.json');

// Set game status on Discord
function setStatus (bot, logger) {
  bot.shards.forEach(shard => {
    // Check if there is a streaming url present, if so set status to streaming
    if (config.stream_url) {
      shard.editStatus({
        name: config.game_info.game_name,
        type: 1,
        url: config.game_info.stream_url
      });

      // Log status change
      logger.info(`Game status set to ${config.game_info.game_name} and stream url set to ${config.game_info.stream_url}`);
    } else {
      shard.editStatus({
        name: config.game_info.game_name,
        type: 0
      });

      // Log status change
      logger.info(`Game status set to ${config.game_info.game_name}`);
    }
  });
}

// Post status to Carbonitex and discord.pw
function postStats (bot, logger) {
  if (config.tokens.botlist_sites.discord_pw_key) {
    axios({
      method: 'post',
      url: `https://bots.discord.pw/api/bots/${bot.user.id}/stats`,
      headers: {
        'Authorization': config.tokens.botlist_sites.discord_pw_key,
        'content-type': 'application/json'
      },
      data: {
        'server_count': bot.guilds.size
      }
    })
      .then(() => {
        logger.info(`Stats posted to discord.pw`);
      })
      .catch(err => {
        logger.error(`FAILURE: Stats not posted to discord.pw ${err}`);
      });
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
        logger.info(`Stats posted to Carbonitex`);
      })
      .catch(err => {
        logger.error(`FAILURE: Stats not posted to Carbonitex ${err}`);
      });
  }

  if (config.tokens.botlist_sites.discordbots_key) {
    axios({
      method: 'post',
      url: `https://discordbots.org/api/bots/${bot.user.id}/stats`,
      headers: {
        'Authorization': config.tokens.botlist_sites.discordbots_key,
        'content-type': 'application/json'
      },
      data: {
        'server_count': bot.guilds.size
      }
    })
      .then(() => {
        logger.info(`Stats posted to discordbots.org`);
      })
      .catch(err => {
        logger.error(`Stats not posted to discordbots.org ${err}`);
      });
  }
}

module.exports = {
  setStatus: setStatus,
  postStats: postStats
};
