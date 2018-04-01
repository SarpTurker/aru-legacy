/**
 * Aru
 * Guild Document Manager
 */

// Setup files and modules
const guildModel = require('../db/models/guild.js');

function addGuild (guildID, logger) {
  guildModel.findById(guildID, (err, server) => { // Query for server
    if (err) { return logger.error(err); } // Log error
    if (!server) { // Create new server if it doesn't exist
      guildModel.create({
        _id: guildID,
        channelsDisabled: [],
        commandDisabled: [],
        tags: [],
        notifications: {
          joinMsgText: '',
          joinMsgChannel: '',
          leaveMsgText: '',
          leaveMsgChannel: '',
          guildMemberUpdateChannel: '',
          messageDeletedChannel: '',
          messageUpdateChannel: ''
        }
      }, (err) => { if (err) { return logger.error(err); } }); // Log error
    }
  });
}

function removeGuild (guildID, logger) {
  guildModel.findById(guildID, (err, server) => { // Query for server
    if (err) { return logger.error(err); } // Log error
    if (server) { // Delete server if it exists
      guildModel.remove({_id: guildID},
        (err) => { if (err) { return logger.error(err); } }); // Log error
    }
  });
}

module.exports = {
  addGuild: addGuild,
  removeGuild: removeGuild
};
