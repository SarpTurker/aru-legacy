/**
 * Aru
 * Queue Command
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
const musicUtils = require('../../utils/musicUtils.js');

module.exports = {
  options: {
    name: 'queue',
    usage: 'queue',
    description: 'View a list of songs queued',
    fullDescription: 'View a list of songs queued.',
    guildOnly: true
  },

  exec: (bot, logger, msg, args) => {
    if (musicUtils.servers[msg.member.guild.id] && musicUtils.servers[msg.member.guild.id].queue[0]) { // Test to see if there is a song in queue
      let queue = '';

      for (let i = 0; i < musicUtils.servers[msg.member.guild.id].queue.length; i++) {
        queue += `**${i + 1}. [${musicUtils.servers[msg.member.guild.id].queue[0].title} by ${musicUtils.servers[msg.member.guild.id].queue[0].author} [${musicUtils.servers[msg.member.guild.id].queue[0].length}]](${musicUtils.servers[msg.member.guild.id].queue[0].url})** requested by **${musicUtils.servers[msg.member.guild.id].queue[0].requester.username}#${musicUtils.servers[msg.member.guild.id].queue[0].requester.discriminator}**\n`; // Print songs in queue
      }
      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '🎵 Queue',
          description: queue,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      });

      logger.cmdUsage(module.exports.options.name, msg, args);
    } else {
      msg.channel.createMessage('Looks like there is no song in the queue.'); // Notify that there is no song in the queue
      logger.cmdUsage(module.exports.options.name, msg, args, 'No song in queue');
    }
  }
};
