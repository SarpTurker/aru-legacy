/**
 * Aru
 * Skip Command
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
    name: 'skip',
    usage: 'skip',
    description: 'Skip currently playing song',
    fullDescription: 'Skip currently playing song.',
    guildOnly: true
  },

  exec: (bot, logger, msg, args) => {
    let voiceChannel = msg.member.guild.channels.get(msg.member.voiceState.channelID);
    let player = musicUtils.getPlayer(bot, logger, voiceChannel);

    if (musicUtils.servers[msg.member.guild.id]) { // Test to see if bot is in a connection
      if (musicUtils.servers[msg.member.guild.id].queue[0]) {
        msg.channel.createMessage({
          embed: {
            color: 16765404,
            title: '🎵 Skip',
            description: `Now skipping **[${musicUtils.servers[msg.member.guild.id].queue[0].title} by ${musicUtils.servers[msg.member.guild.id].queue[0].author} [${musicUtils.servers[msg.member.guild.id].queue[0].length}]](${musicUtils.servers[msg.member.guild.id].queue[0].url})** requested by **${musicUtils.servers[msg.member.guild.id].queue[0].requester.username}#${musicUtils.servers[msg.member.guild.id].queue[0].requester.discriminator}**`,
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });

        player.stop(); // Stop playing the song
        logger.cmdUsage(module.exports.options.name, msg, args);
      }
    } else {
      msg.channel.createMessage('Looks like there is no song to skip.'); // Notify that there is no song to skip
      logger.cmdUsageWarn(module.exports.options.name, msg, args, 'No song to skip');
    }
  }
};
