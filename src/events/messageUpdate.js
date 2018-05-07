/**
 * Aru
 * Message Update Event
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
  name: 'messageUpdate',

  exec: (bot, logger, message, oldMessage) => {
    if (message && oldMessage && message.channel && message.channel.guild && message.embeds && message.author && !message.author.bot && message.content && oldMessage.content && message.content !== oldMessage.content) {
      guildModel.findOne({ _id: message.channel.guild.id }, 'notifications', (err, server) => { // Query for notifications
        if (err) { return logger.error(err); }
        if (server.notifications.messageUpdateChannel) {
          message.channel.guild.channels.find((channel) => {
            if (channel.id === server.notifications.messageUpdateChannel) {
              channel.createMessage({
                embed: {
                  color: 16765404,
                  title: `📝 Message changed by ${message.author.username}#${message.author.discriminator} in #${message.channel.name}`,
                  fields: [
                    {
                      name: 'Old Message',
                      value: oldMessage.content.substr(0, 1024)
                    },
                    {
                      name: 'New Message',
                      value: message.content.substr(0, 1024)
                    }
                  ],
                  timestamp: new Date(),
                  footer: {
                    icon_url: bot.user.avatarURL,
                    text: bot.user.username
                  }
                }
              });
            }
          });
        }
      });
    }
  }
};
