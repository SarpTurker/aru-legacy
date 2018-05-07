/**
 * Aru
 * Ready Event
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
const glob = require('glob-promise');
const { PlayerManager } = require('eris-lavalink');
const statusManager = require('../utils/statusManager');
const db = require('../db/db');
const api = require('../api/api');
const lavalinkConfig = require('../config/lavalink.json');

module.exports = {
  name: 'ready',

  exec: (bot, logger) => {
    logger.info(`Bot is currently logged in as ${bot.user.username}#${bot.user.discriminator} on ${bot.guilds.size} servers, ${bot.shards.size} shards, and serving ${bot.users.size} users`); // Log start message
    statusManager.setStatus(bot, logger); // Set game status
    statusManager.postStats(bot, logger); // Post stats

    if (!(bot.voiceConnections instanceof PlayerManager)) {
      bot.voiceConnections = new PlayerManager(bot, lavalinkConfig.nodes, {
        numShards: bot.shards.size,
        userId: bot.user.id,
        regions: lavalinkConfig.regions,
        defaultRegion: 'us'
      });
    }

    // Load Commands
    glob('./commands/**/*.js')
      .then(files => {
        logger.info(`${files.length} commands to load`); // Log number of commands to load

        files.forEach(file => {
          let command = require(`.${file}`);

          bot.registerCommand(command.options.name, (msg, args) => { command.exec(bot, logger, msg, args); }, command.options); // Register command
        });
      });

    // Setup DB
    db(bot, logger);

    // Start express server
    api(bot, logger);
  }
};
