/**
 * Aru
 * Meme Command
 */

module.exports = function (bot, logger) {
  bot.registerCommand('meme', (msg, args) => {
    let [topword, bottomword, url] = args
    bot.createMessage(msg.channel.id, `https://memegen.link/custom/${topword}/${bottomword}.jpg?alt=${url}?font=impact`)
  })
}
