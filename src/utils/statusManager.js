/**
 * Aru
 * Status Manager
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
  // Set game status on Discord
  setStatus: (bot, logger) => {
    bot.shards.forEach(shard => {
      // Check if there is a streaming url present, if so set status to streaming
      if (process.env.STREAM_URL) {
        shard.editStatus({
          name: process.env.GAME_NAME || '',
          type: 1,
          url: process.env.STREAM_URL
        });
        logger.info(`Game status set to ${process.env.GAME_NAME || ''} and stream url set to ${process.env.STREAM_URL}`);
      } else {
        shard.editStatus({
          name: process.env.GAME_NAME || '',
          type: 0
        });
        logger.info(`Game status set to ${process.env.GAME_NAME || ''}`);
      }
    });
  },

  // Post stats to bot lists
  postStats: (bot, logger) => {
    if (process.env.DISCORD_PW_KEY) {
      axios({
        method: 'post',
        url: `https://bots.discord.pw/api/bots/${bot.user.id}/stats`,
        headers: {
          'Authorization': process.env.DISCORD_PW_KEY,
          'content-type': 'application/json'
        },
        data: {
          'server_count': bot.guilds.size,
          'shard_count': bot.shards.size
        }
      })
        .then(() => {
          logger.info(`Stats posted to discord.pw`);
        })
        .catch(err => {
          logger.error(`Stats not posted to discord.pw: ${err}`);
        });
    }

    if (process.env.CARBONITEX_KEY) {
      axios({
        method: 'post',
        url: 'https://www.carbonitex.net/discord/data/botdata.php',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          'key': process.env.CARBONITEX_KEY,
          'servercount': bot.guilds.size
        }
      })
        .then(() => {
          logger.info(`Stats posted to Carbonitex`);
        })
        .catch(err => {
          logger.error(`Stats not posted to Carbonitex: ${err}`);
        });
    }

    if (process.env.DISCORDBOTS_KEY) {
      axios({
        method: 'post',
        url: `https://discordbots.org/api/bots/${bot.user.id}/stats`,
        headers: {
          'Authorization': process.env.DISCORDBOTS_KEY,
          'content-type': 'application/json'
        },
        data: {
          'server_count': bot.guilds.size,
          'shards': bot.shards.size
        }
      })
        .then(() => {
          logger.info(`Stats posted to discordbots.org`);
        })
        .catch(err => {
          logger.error(`Stats not posted to discordbots.org: ${err}`);
        });
    }
  }
};
