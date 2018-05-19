/**
 * Aru
 * Main Bot File
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
const Eris = require('eris');
const LoggerExtended = require('./utils/loggerExtended');
const glob = require('glob-promise');

// Create new logger
const logger = new LoggerExtended({
  file: 'log.log', // File to log to
  raven: {
    url: process.env.SENTRY_URL, // Use Sentry URL from env variable
    config: {
      captureUnhandledRejections: true
    }
  }
});

// Create new Eris client
const bot = new Eris.CommandClient(process.env.DISCORD_TOKEN, {
  maxShards: 'auto' // Use Discord recommended shard count
}, {
  defaultHelpCommand: false, // Disable default Eris help command
  prefix: process.env.PREFIX // Set prefix to the one defined in env variable
});

// Attach Events
glob('./events/*.js')
  .then(files => {
    logger.info(`${files.length} events to load`); // Log number of events to load

    files.forEach(file => {
      let event = require(file);
      bot.on(event.name, (...args) => {
        event.exec(bot, logger, ...args); // Call event function
      });
    });
  });

// Connect to Discord
bot.connect();
