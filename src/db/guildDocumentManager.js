/**
 * Aru
 * Guild Document Manager
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
  addGuild: (guildID, logger) => {
    guildModel.findById(guildID, (err, server) => { // Query for server
      if (err) { return logger.error(err); }
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
        }, (err) => { if (err) { return logger.error(err); } });
      }
    });
  },

  removeGuild: (guildID, logger) => {
    guildModel.findById(guildID, (err, server) => { // Query for server
      if (err) { return logger.error(err); }
      if (server) { // Delete server if it exists
        guildModel.remove({_id: guildID},
          (err) => { if (err) { return logger.error(err); } });
      }
    });
  }
};
