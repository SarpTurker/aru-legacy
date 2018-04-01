/**
 * Aru
 * Guild Delete Event
 */

// Setup files and modules
const statusManager = require('../utils/statusManager.js');
const guildDocumentManager = require('../db/guildDocumentManager.js');

module.exports = function (bot, logger, guild) {
  statusManager.postStats(bot, logger); // Post stats
  logger.info(`Bot has left ${guild.name} ID#${guild.id}`); // Log event
  guildDocumentManager.removeGuild(guild.id, logger); // Update servers
};
