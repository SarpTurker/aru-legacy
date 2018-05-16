/**
 * Aru
 * Play Command
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
    name: 'play',
    usage: 'play <url> or play search <song name>',
    description: 'Play a song from url or name',
    fullDescription: 'Play a song from url or name.',
    guildOnly: true
  },

  exec: (bot, logger, msg, args) => {
    let voiceChannel = msg.member.guild.channels.get(msg.member.voiceState.channelID);

    if (!msg.member.voiceState.channelID) { // Test to see if user is not in voice channel
      msg.channel.createMessage('Please join a voice channel before playing a song!');
      logger.cmdUsageWarn(module.exports.options.name, msg, args, 'Not in voice channel');
      return;
    }

    if (!voiceChannel.permissionsOf(bot.user.id).has('voiceConnect')) { // Test to see if bot has permission to join voice channel
      msg.channel.createMessage('Bot does not have the permission to connect to the voice channel.');
      logger.cmdUsageWarn(module.exports.options.name, msg, args, 'Bot does not have connect permission');
      return;
    }

    if (!voiceChannel.permissionsOf(bot.user.id).has('voiceSpeak')) { // Test to see if bot has permission to speak in voice channel
      msg.channel.createMessage('Bot does not have the permission to speak in the voice channel.');
      logger.cmdUsageWarn(module.exports.options.name, msg, args, 'Bot does not have speak permission');
      return;
    }

    if (!args[0]) { // Test to make sure user put in args
      msg.channel.createMessage('Please put in a valid URL after the command or use the search function to find a song.');
      logger.cmdUsageWarn(module.exports.options.name, msg, args, 'No URL');
      return;
    }

    if (!musicUtils.servers[msg.member.guild.id]) { // Create server and queue if it doesn't exist
      musicUtils.servers[msg.member.guild.id] = {
        queue: []
      };
    }

    // Build search query
    let searchQuery = 'ytsearch:';

    if (args[0] === 'search') {
      for (let i = 1; i < args.length; i++) {
        searchQuery += args[i] + ' ';
      }
    } else {
      searchQuery = args[0];
    }

    musicUtils.getInfo(bot, logger, msg, voiceChannel, searchQuery); // Get info on song
  }
};
