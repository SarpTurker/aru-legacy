/**
 * Aru
 * Database
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
const mongoose = require('mongoose');
const guildDocumentManager = require('../db/guildDocumentManager');

module.exports = (bot, logger) => {
  // Connect to Database
  mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      logger.info('Database connected');

      // Initalize servers
      for (let guild of bot.guilds) {
        guildDocumentManager.addGuild(guild[0], logger);
      }

      logger.info(`Updated servers`);
    })
    .catch(err => {
      logger.error(`Connection error: ${err}`);
    });
};
