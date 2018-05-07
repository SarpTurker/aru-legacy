/**
 * Aru
 * About Command
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

module.exports = {
  options: {
    name: 'about',
    usage: 'about',
    description: 'Responds with bot info',
    fullDescription: 'Responds with bot info.'
  },

  exec: (bot, logger, msg, args) => {
    msg.channel.createMessage({
      embed: {
        color: 16765404,
        title: 'Description',
        description: `${bot.user.username} is a modular Discord bot powered by Eris with miscellaneous functions.\n\n**Github**: https://github.com/perhion/aru`,
        thumbnail: {
          url: bot.user.avatarURL
        },
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: bot.user.username
        }
      }
    });

    logger.cmdUsage(module.exports.options.name, msg, args);
  }
};
