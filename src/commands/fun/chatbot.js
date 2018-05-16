/**
 * Aru
 * Chatbot Command
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
  options: {
    name: 'c',
    usage: 'c <message>',
    description: 'Chat with the bot',
    fullDescription: 'Chat with the bot through Program-O API.'
  },

  exec: (bot, logger, msg, args) => {
    // Test to make sure user put in args
    if (!args[0]) {
      msg.channel.createMessage(`Please put in a chat message following \`${module.exports.options.name}\` to chat with the bot.`);
      logger.cmdUsageWarn(module.exports.options.name, msg, args, 'No chat text');
      return;
    }

    // Make GET request
    axios
      .get(`http://api.program-o.com/v2/chatbot/?bot_id=6&say=${args}&convo_id=discordaru_${msg.author.id}&format=json`)
      .then(response => {
        // Create message
        msg.channel.createMessage({
          embed: {
            author: {
              name: msg.author.username + '#' + msg.author.discriminator,
              icon_url: msg.author.avatarURL
            },
            color: 16765404,
            description: `${response.data.botsay.replace('Program-O', bot.user.username).replace('</br>', '').replace('Elizabeth', 'Pyro')}`,
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });

        logger.cmdUsage(module.exports.options.name, msg, args);
      })
      .catch(err => {
        msg.channel.createMessage(`An error has occured: ${err}`);
        logger.cmdUsageError(module.exports.options.name, msg, args, err);
      });
  }
};
