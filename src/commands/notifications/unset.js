/**
 * Aru
 * Unset Notification Command
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
const guildModel = require('../../db/models/guild.js');

module.exports = {
  options: {
    name: 'unset',
    usage: 'unset <type>',
    description: 'Unsets notification. See extended help for more info.',
    fullDescription: 'Unsets notification. Types: join, leave, memberupdate, messagedelete, messageupdate',
    requirements: {
      permissionMessage: 'Only users with the Manage Server permission will be able to use this command.',
      permissions: {
        'manageGuild': true
      }
    },
    guildOnly: true
  },

  exec: function (bot, logger, msg, args) {
    if (args[0] !== 'join' && args[0] !== 'leave' && args[0] !== 'memberupdate' && args[0] !== 'messagedelete' && args[0] !== 'messageupdate') {
      msg.channel.createMessage(`Please put in a valid type: join, leave, memberupdate, messagedelete, messageupdate.`);
      logger.cmdUsageError(module.exports.options.name, msg, args, 'Invalid type');
      return;
    }

    if (args[0] === 'join') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.joinMsgChannel': ''
      }}, (err) => { if (err) { return logger.error(err); } });

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '📝 Join Notification Unset',
          description: `Join notification will no longer be displayed.`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      });

      logger.cmdUsage(module.exports.options.name, msg, args);
      return;
    }

    if (args[0] === 'leave') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.leaveMsgChannel': ''
      }}, (err) => { if (err) { return logger.error(err); } });

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '📝 Leave Notification Unset',
          description: `Leave notification will no longer be displayed.`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      });

      logger.cmdUsage(module.exports.options.name, msg, args);
      return;
    }

    if (args[0] === 'memberupdate') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.guildMemberUpdateChannel': ''
      }}, (err) => { if (err) { return logger.error(err); } });

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '📝 Member Update Notification Unset',
          description: `Nickname changes will no longer be displayed.`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      });

      logger.cmdUsage(module.exports.options.name, msg, args);
      return;
    }

    if (args[0] === 'messagedelete') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.messageDeletedChannel': ''
      }}, (err) => { if (err) { return logger.error(err); } });

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '📝 Message Delete Notification Unset',
          description: `Message delete notifications will no longer be displayed.`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      });

      logger.cmdUsage(module.exports.options.name, msg, args);
      return;
    }

    if (args[0] === 'messageupdate') {
      guildModel.update({ _id: msg.channel.guild.id }, { $set: {
        'notifications.messageUpdateChannel': ''
      }}, (err) => { if (err) { return logger.error(err); } });

      msg.channel.createMessage({
        embed: {
          color: 16765404,
          title: '📝 Message Edit Notification Unset',
          description: `Message edit notifications will no longer be displayed.`,
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
          }
        }
      });

      logger.cmdUsage(module.exports.options.name, msg, args);
    }
  }
};
