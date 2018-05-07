/**
 * Aru
 * Guild Member Add Event
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
const guildModel = require('../db/models/guild');

module.exports = {
  name: 'guildMemberAdd',

  exec: (bot, logger, guild, member) => {
    guildModel.findOne({ _id: guild.id }, 'notifications', (err, server) => { // Query for notifications
      if (err) { return logger.error(err); }
      if (server.notifications && server.notifications.leaveMsgChannel) {
        guild.channels.find((channel) => {
          if (channel.id === server.notifications.joinMsgChannel) {
            bot.createMessage(server.notifications.joinMsgChannel, server.notifications.joinMsgText.replace('{mention}', member.mention).replace('{guild_name}', guild.name).replace('{username}', member.username).replace('{discriminator}', member.discriminator).replace('{id}', member.id).replace('{guild}', guild.name));
          }
        });
      }
    });
  }
};
