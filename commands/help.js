/**
 * Aru
 * Help Command
 */

// Setup files and modules
const config = require('../config.json')

const prefix = config.prefix

module.exports = function (bot, logger) {
  bot.registerCommand('help', (msg) => {
    bot.getDMChannel(msg.author.id)
    .then(channel =>
      channel.createMessage(
        `**Commands\n\n
        Info Commands:**\n
        **${prefix}help** - This help menu\n
        **${prefix}ping** - Get bot stats\n
        **${prefix}about** - Get information about the bot\n\n
        **Profiler Commands:**\n
        **${prefix}profile @UserName** - Get user details\n
        **${prefix}serverinfo** - Get info about the server\n\n
        **Anime Commands:**\n
        **${prefix}anime animename** - Get information about an anime via kitsu.io\n
        **${prefix}manga manganame** - Get information about a manga via kitsu.io\n\n
        **IMDb Commands:**\n
        **${prefix}movie moviename** - Get information about a movie via TMDb\n\n
        **Game Info Commands:**\n
        **${prefix}ow username platform region** - Get information from a Overwatch profile. 
        Replace username with Battletag, platform with pc, xbl, or psn, and region 
        with eu, kr, us, global, cn\n\n
        **Misc. Commands:**\n
        **${prefix}c** - Chat with the bot (uses Program-O)\n
        **${prefix}meme** ***topline bottomline imageurl*** - Generate a meme\n\n`)
    )
    .catch(function (error) {
      bot.createMessage(msg.channel.id, 'Could not send message, check that bot has permission to PM you.')
      logger.info(new Date() + ': ' + 'FAILURE: Help command used by ' + msg.author.username + '#' + msg.author.discriminator + ' in ' + msg.channel.guild.name)
    })
  })
}
