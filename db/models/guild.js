/**
 * Aru
 * Guild Model
 */

const mongoose = require('mongoose')

// Create Schema and Model
module.exports = mongoose.model('guilds', new mongoose.Schema({
  _id: String,
  channelsDisabled: [],
  commandDisabled: [],
  tags: [],
  notifications: {
    joinMsgText: String,
    joinMsgChannel: String,
    leaveMsgText: String,
    leaveMsgChannel: String,
    guildMemberUpdateChannel: String,
    messageDeletedChannel: String,
    messageUpdateChannel: String
  }
}))
