/**
 * Aru
 * Change Username Command
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
const getBotOwnerID = require('../../utils/getBotOwnerID.js');

module.exports = {
  options: {
    name: 'changeusername',
    usage: 'changeusername <username>',
    hidden: true,
    description: 'Change bot username.',
    fullDescription: 'Change bot username.'
  },

  exec: (bot, logger, msg, args) => {
    if (getBotOwnerID.ownerID !== msg.author.id) {
      msg.channel.createMessage('Only the botmaster can call this command');
      return;
    }

    bot
      .editSelf({
        username: args.join(' ')
      })
      .then(() => {
        msg.channel.createMessage({
          embed: {
            color: 16765404,
            title: 'Bot Username Changed',
            description: `Bot username has been changed to ${args.join(' ')}.`,
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });
      })
      .catch((err) => {
        logger.error(err);
      });

    logger.cmdUsage(module.exports.options.name, msg, args);
  }
};
