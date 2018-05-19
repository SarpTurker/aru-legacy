/**
 * Aru
 * Volume Command
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
const musicUtils = require('../../utils/musicUtils');

module.exports = {
  options: {
    name: 'volume',
    usage: 'volume <number>',
    description: 'Change the volume for music.',
    fullDescription: 'Change the volume for music.',
    guildOnly: true
  },

  exec: (bot, logger, msg, args) => {
    let voiceChannel = msg.member.guild.channels.get(msg.member.voiceState.channelID);
    let player = musicUtils.getPlayer(bot, logger, voiceChannel);

    if (musicUtils.servers[msg.member.guild.id] && musicUtils.servers[msg.member.guild.id].queue[0]) { // Test to see if bot is in a connection and that there is a song
      if (!args) {
        msg.channel.createMessage('Please set a number you would like me to set.');
        return logger.cmdUsageWarn(module.exports.options.name, msg, args, 'No args');
      } else if (!Number.isInteger((Number(args)) || isNaN(args))) {
        msg.channel.createMessage('Please enter a number.');
        return logger.cmdUsageWarn(module.exports.options.name, msg, args, 'Args not a number');
      } else if (args > 100) {
        msg.channel.createMessage('Volume cannot be over 100.');
        return logger.cmdUsageWarn(module.exports.options.name, msg, args, 'Volume over 100');
      } else if (args < 4) {
        msg.channel.createMessage('Volume cannot be below 4.');
        return logger.cmdUsageWarn(module.exports.options.name, msg, args, 'Volume below 4');
      } else {
        msg.channel.createMessage({
          embed: {
            color: 16765404,
            title: '🎵 Volume Changed',
            description: `Volume has been set to ${args}%`,
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });

        logger.cmdUsage(module.exports.options.name, msg, args);
        player.setVolume(parseInt(args));
      }
    }
  }
};
