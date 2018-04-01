/**
 * Aru
 * MongoDB
 */

// Setup files and modules
const mongoose = require('mongoose');
const guildDocumentManager = require('../db/guildDocumentManager.js');

module.exports = function (bot, logger) {
  // Connect to Database
  mongoose.connect('mongodb://localhost/aru')
    .then(() => {
      logger.info('Database connected');
      // Initalize servers
      for (let guild of bot.guilds) { // Add servers that isn't in the DB
        guildDocumentManager.addGuild(guild[0], logger);
      }
      logger.info(`Updated servers`); // Log event
    })
    .catch(err => {
      logger.error(`Connection error: ${err}`);
    });
};
