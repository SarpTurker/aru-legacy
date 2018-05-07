/**
 * Aru
 * Message Delete Event
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
  name: 'messageDelete',

  exec: (bot, logger, message) => {
    if (message && message.channel && message.channel.guild && message.author && !message.author.bot) {
      guildModel.findOne({ _id: message.channel.guild.id }, 'notifications', (err, server) => { // Query for notifications
        if (err) { return logger.error(err); }
        if (server.notifications.messageDeletedChannel) {
          message.channel.guild.channels.find((channel) => {
            if (channel.id === server.notifications.messageDeletedChannel) {
              channel.createMessage({
                embed: {
                  color: 16765404,
                  title: `📝 ${message.author.username}#${message.author.discriminator}'s Message Deleted in #${message.channel.name}`,
                  description: `${message.content}`.substr(0, 2048),
                  image: {
                    url: message.attachments[0] ? message.attachments[0].url : ''
                  },
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
