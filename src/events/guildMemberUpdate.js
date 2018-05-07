/**
 * Aru
 * Guild Member Update Event
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
  name: 'guildMemberUpdate',

  exec: (bot, logger, guild, member, oldMember) => {
    guildModel.findOne({ _id: guild.id }, 'notifications', (err, server) => { // Query for notifications
      if (err) { return logger.error(err); }
      if (server && server.notifications && server.notifications.guildMemberUpdateChannel) {
        guild.channels.find((channel) => {
          if (channel.id === server.notifications.guildMemberUpdateChannel) {
            if (member.nick) {
              if (member.nick !== oldMember.nick) {
                channel.createMessage({
                  embed: {
                    color: 16765404,
                    title: '📝 Nickname Change Detected',
                    description: `**${member.user.username}#${member.user.discriminator}** has changed their nickname from **${oldMember.nick || 'No Nickname'}** to **${member.nick || 'No Nickname'}**`,
                    timestamp: new Date(),
                    footer: {
                      icon_url: bot.user.avatarURL,
                      text: bot.user.username
                    }
                  }
                });
              }
            } else if (oldMember && oldMember.nick) {
              channel.createMessage({
                embed: {
                  color: 16765404,
                  title: '📝 Nickname Change Detected',
                  description: `**${member.user.username}#${member.user.discriminator}** has changed their nickname from **${oldMember.nick || 'No Nickname'}** to **No Nickname**`,
                  timestamp: new Date(),
                  footer: {
                    icon_url: bot.user.avatarURL,
                    text: bot.user.username
                  }
                }
              });
            }
          }
        });
      }
    });
  }
};
