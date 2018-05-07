/**
 * Aru
 * Guild Create Event
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
const statusManager = require('../utils/statusManager');
const guildDocumentManager = require('../db/guildDocumentManager');

module.exports = {
  name: 'guildCreate',

  exec: (bot, logger, guild) => {
    statusManager.postStats(bot, logger); // Post stats
    logger.info(`Bot has joined ${guild.name} ID#${guild.id}`);
    guildDocumentManager.addGuild(guild.id, logger); // Add guild to DB
  }
};
