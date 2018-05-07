/**
 * Aru
 * Change Picture Command
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
const getBotOwnerID = require('../../utils/getBotOwnerID.js');

module.exports = {
  options: {
    name: 'changepicture',
    usage: 'changepicture <url>',
    hidden: true,
    description: 'Change bot picture.',
    fullDescription: 'Change bot picture.'
  },

  exec: async (bot, logger, msg, args) => {
    if (getBotOwnerID.ownerID !== msg.author.id) {
      msg.channel.createMessage('Only the botmaster can call this command');
      return;
    }

    let image = await axios.get(msg.attachments[0].url).catch((err) => { logger.error(err); });

    bot
      .editSelf({
        avatar: `data:${image.headers['content-type']};base64,${image.data.toString('base64')}`
      })
      .then(() => {
        msg.channel.createMessage({
          embed: {
            color: 16765404,
            title: 'Bot Picture Changed',
            image: {
              url: msg.attachments[0] ? msg.attachments[0].url : ''
            },
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
