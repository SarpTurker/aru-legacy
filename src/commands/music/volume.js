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
    let player = musicUtils.getPlayer(bot, voiceChannel);
    
    if(musicUtils.servers[msg.member.guild.id]) {
      if(musicUtils.servers[msg.member.guild.id].queue[0]) {
          if(!args) return 'Number is a required argument!\nUsage: `volume <number>`'
          if(!Number.isInteger((Number(args)) || isNaN(args))) {
            return 'That doesn\'t look like a number.'
          if(args > 100) {
            return 'Volume cannot be over 100.'
          }
          if(args < 4) {
            return 'Volume cannot be below 4.'
          } else {
            msg.channel.createMessage(`Volume has been set to ${args}%`)
            player.setVolume(parseInt(args))
          }
        }
      }
    }    
  }
};
