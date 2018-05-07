/**
 * Aru
 * Logger Extension
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
const Akalogger = require('akalogger');

module.exports = class AruLog extends Akalogger {
  cmdUsage (cmdName, msg, args) {
    if (!msg.channel.guild) {
      this.info(`${cmdName} used by ${msg.author.username}#${msg.author.discriminator} in private messages with args ${args}`);
    } else {
      this.info(`${cmdName} used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}#${msg.channel.name} with args ${args}`);
    }
  }

  cmdUsageError (cmdName, msg, args, err) {
    if (!msg.channel.guild) {
      this.error(`${cmdName} used by ${msg.author.username}#${msg.author.discriminator} in private messages with args ${args}: ${err}`);
    } else {
      this.error(`${cmdName} used by ${msg.author.username}#${msg.author.discriminator} in ${msg.channel.guild.name}#${msg.channel.name} with args ${args}: ${err}`);
    }
  }
};
