/**
 * Aru
 * Ping Command
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
    name: 'ping',
    usage: 'ping',
    description: 'Print response time (ms)',
    fullDescription: 'Print response time (ms).'
  },

  exec: (bot, logger, msg, args) => {
    let initTime = Date.now(); // Store time at run

    msg.channel.createMessage('Calculating...')
      .then(editedMsg => {
        editedMsg.edit({ // Edit message with latency
          content: '',
          embed: {
            color: 16765404,
            fields: [
              {
                name: 'Shard Latency',
                value: `${msg.channel.guild.shard.latency} ms`
              },
              {
                name: 'Reply Latency',
                value: `${Date.now() - initTime} ms`
              }
            ],
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });
      })
      .catch(err => {
        msg.channel.createMessage(`An error occured getting ping: ${err}`);

        logger.cmdUsageError(module.exports.options.name, msg, args, err);
      });

    logger.cmdUsage(module.exports.options.name, msg, args);
  }
};
