/**
 * Aru
 * Help Command
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

module.exports = {
  options: {
    name: 'help',
    usage: 'help',
    description: 'DM a list of commands',
    fullDescription: 'DM a list of commands. If a name of a command is added after the command call a full description of the command will be given in chat Ex: help <command name>.'
  },

  exec: (bot, logger, msg, args) => {
    function createCommandList () {
      let commands = ''; // Hold command string

      for (let command in bot.commands) { // Create field for group
        commands += `**${process.env.PREFIX}`;
        commands += bot.commands[command].usage;
        commands += '** - ';
        commands += bot.commands[command].description;
        commands += '\n';
      }
      commands += `\nRun **${process.env.PREFIX}help <command name>** for more info on a specific command\n`;

      return commands;
    }

    if (args[0] in bot.commands) {
      if (bot.commands[args[0]]) {
        msg.channel.createMessage({
          embed: {
            color: 16765404,
            title: bot.commands[args[0]].label,
            description: `**Usage:** ${bot.commands[args[0]].usage}\n\n**Description:**\n${bot.commands[args[0]].fullDescription}`,
            timestamp: new Date(),
            footer: {
              icon_url: bot.user.avatarURL,
              text: bot.user.username
            }
          }
        });
        logger.cmdUsage(module.exports.options.name, msg, args);
      } else {
        msg.channel.createMessage(`Command not found.`);
        logger.cmdUsageError(module.exports.options.name, msg, args, 'Command not found');
      }
    } else {
      bot.getDMChannel(msg.author.id)
        .then(channel => {
          channel.createMessage({
            embed: {
              color: 16765404,
              title: 'Help',
              description: createCommandList(),
              timestamp: new Date(),
              footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.username
              }
            }
          });

          if (msg.channel.guild) { // Tell user PM has been sent if message was sent from guild
            msg.channel.createMessage(`:mailbox_with_mail: Help sent to PM.`);
          }

          logger.cmdUsage(module.exports.options.name, msg, args);
        })
        .catch(err => {
          bot.createMessage(msg.channel.id, `Could not send help message, check that bot has permission to PM you.`);
          logger.cmdUsageError(module.exports.options.name, msg, args, err);
        });
    }
  }
};
