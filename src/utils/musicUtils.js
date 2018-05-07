/**
 * Aru
 * Music Utils
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
const moment = require('moment');
const lavalinkConfig = require('../config/lavalink.json');

module.exports = {
  servers: [],

  resolveTracks: async (logger, node, searchQuery) => {
    let result = await axios.get(`http://${node.host}:2333/loadtracks?identifier=${searchQuery}`, {
      headers: {
        'Authorization': node.password,
        'Accept': 'application/json'
      }
    });

    if (!result) {
      throw new Error('Unable play the video');
    }
    return result.data;
  },

  getPlayer: (bot, logger, channel) => {
    if (!channel || !channel.guild) {
      throw new Error('No guild channel');
    }

    let player = bot.voiceConnections.get(channel.guild.id);
    if (player) return player; // Return player if it already exists

    let options = {};
    if (channel.guild.region) {
      options.region = channel.guild.region;
    }

    return bot.joinVoiceChannel(channel.id, options);
  },

  playMusic: async (bot, logger, msg, voiceChannel) => {
    let player = await module.exports.getPlayer(bot, logger, voiceChannel);

    player.setVolume(45);

    let playSong = () => {
      player.play(module.exports.servers[msg.member.guild.id].queue[0].track); // Play track
      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '🎵 Playing',
          description: `Now playing **[${module.exports.servers[msg.member.guild.id].queue[0].title} by ${module.exports.servers[msg.member.guild.id].queue[0].author} [${module.exports.servers[msg.member.guild.id].queue[0].length}]](${module.exports.servers[msg.member.guild.id].queue[0].url})** requested by **${module.exports.servers[msg.member.guild.id].queue[0].requester.username}#${module.exports.servers[msg.member.guild.id].queue[0].requester.discriminator}**`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      });
      logger.info(`Song ${module.exports.servers[msg.member.guild.id].queue[0].title} requested by ${module.exports.servers[msg.member.guild.id].queue[0].requester.username}#${module.exports.servers[msg.member.guild.id].queue[0].requester.discriminator} in ${module.exports.servers[msg.member.guild.id].queue[0].channel.guild.name} now playing`);
    };

    player.on('end', () => {
      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '🎵 Finished',
          description: `Finished **[${module.exports.servers[msg.member.guild.id].queue[0].title} by ${module.exports.servers[msg.member.guild.id].queue[0].author} [${module.exports.servers[msg.member.guild.id].queue[0].length}]](${module.exports.servers[msg.member.guild.id].queue[0].url})** requested by **${module.exports.servers[msg.member.guild.id].queue[0].requester.username}#${module.exports.servers[msg.member.guild.id].queue[0].requester.discriminator}**`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      });
      logger.info(`Song ${module.exports.servers[msg.member.guild.id].queue[0].title} requested by ${module.exports.servers[msg.member.guild.id].queue[0].requester.username}#${module.exports.servers[msg.member.guild.id].queue[0].requester.discriminator} in ${module.exports.servers[msg.member.guild.id].queue[0].channel.guild.name} has finished`);
      module.exports.servers[msg.member.guild.id].queue.shift(); // Remove from queue
      if (module.exports.servers[msg.member.guild.id].queue[0]) {
        playSong();
      } else {
        voiceChannel.leave(); // Leave voice channel
      }
    });

    player.on('error', err => {
      logger.error(err);
    });

    player.on('disconnect', err => {
      logger.error(err);
    });

    playSong();
  },

  getInfo: async (bot, logger, msg, voiceChannel, searchQuery) => {
    let tracks = await module.exports.resolveTracks(logger, lavalinkConfig.nodes[0], searchQuery);
    if (tracks.length === 0) {
      msg.channel.createMessage('Song not found.');
      return;
    }
    let song = { // Template for song
      title: tracks[0].info.title,
      author: tracks[0].info.author,
      url: tracks[0].info.uri,
      length: moment.utc(tracks[0].info.length * 1000).format('HH:mm:ss'),
      requester: msg.author,
      channel: msg.channel,
      track: tracks[0].track
    };
    module.exports.servers[msg.member.guild.id].queue.push(song); // Push to queue

    let songAdded = module.exports.servers[msg.member.guild.id].queue[module.exports.servers[msg.member.guild.id].queue.length - 1];

    msg.channel.createMessage({
      embed: {
        color: 16765404,
        title: '🎵 Added to Queue',
        description: `**[${songAdded.title} by ${songAdded.author} [${songAdded.length}]](${songAdded.url})** requested by **${songAdded.requester.username}#${songAdded.requester.discriminator}** has been added to queue at position #${module.exports.servers[msg.member.guild.id].queue.length}`,
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: bot.user.username
        }
      }
    });
    logger.info(`Song ${songAdded.title} added to queue by ${songAdded.requester.username}#${songAdded.requester.discriminator} in ${songAdded.channel.guild.name} with song url ${songAdded.url}`);

    if (!module.exports.servers[msg.member.guild.id].queue[1]) { // Play the music if it isn't already being played
      module.exports.playMusic(bot, logger, msg, voiceChannel);
    }
  }
};
