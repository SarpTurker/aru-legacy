/**
 * Aru
 * Summon Command
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
    name: 'summon',
    usage: 'summon',
    description: 'Make the bot move channels.', 
    fullDescription: 'Make the bot move channels.',
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
            title: '🎵 Moving channels',
            description: `Moving bot to **${voiceChannel.name}**`,
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });

        player.switchChannel(voiceChannel.id, true); // Switch channels
        logger.cmdUsage(module.exports.options.name, msg, args);
      }
    } else {
      msg.channel.createMessage('Looks like there is no channel the bot can be moved to.'); // Notify that there is no song to skip
      logger.cmdUsageWarn(module.exports.options.name, msg, args, 'No channel to move bot to.');
    }
  }
};
