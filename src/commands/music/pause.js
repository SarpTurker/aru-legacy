/**
 * Aru
 * Pause Command
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
    name: 'pause',
    usage: 'pause <yes/no>',
    description: 'Pause/unpause currently playing song',
    fullDescription: 'Pause/unpause currently playing song. Type yes to pause, no to unpause.',
    guildOnly: true
  },

  exec: (bot, logger, msg, args) => {
    let voiceChannel = msg.member.guild.channels.get(msg.member.voiceState.channelID);
    let player = musicUtils.getPlayer(bot, logger, voiceChannel);

    if (args[0] === 'yes') {
      if (musicUtils.servers[msg.member.guild.id]) { // Test to see if bot is in a connection
        if (musicUtils.servers[msg.member.guild.id].queue[0]) {
          msg.channel.createMessage({
            embed: {
              color: 16765404,
              title: '🎵 Pausing',
              description: `Music bot is now pausing.`,
              timestamp: new Date(),
              footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.username
              }
            }
          });

          player.setPause(true); // Pause the song
          logger.cmdUsage(module.exports.options.name, msg, args);
        }
      } else {
        msg.channel.createMessage('Looks like there is no song to pause.'); // Notify that there is no song to pause
        logger.cmdUsage(module.exports.options.name, msg, args, 'No song to pause');
      }
    }
    if (args[0] === 'no') {
      if (musicUtils.servers[msg.member.guild.id]) { // Test to see if bot is in a connection
        if (musicUtils.servers[msg.member.guild.id].queue[0]) {
          msg.channel.createMessage({
            embed: {
              color: 16765404,
              title: '🎵 Unpausing',
              description: `Music bot is now unpausing.`,
              timestamp: new Date(),
              footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.username
              }
            }
          });

          player.setPause(false); // Unpause the song
          logger.cmdUsage(module.exports.options.name, msg, args);
        }
      } else {
        msg.channel.createMessage('Looks like there is no song to unpause.'); // Notify that there is no song to unpause
        logger.cmdUsage(module.exports.options.name, msg, args, 'No song to unpause');
      }
    }
  }
};
