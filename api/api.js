/**
 * Aru
 * API
 */

module.exports = function (bot, logger) {
  // Setup files and modules
  const express = require('express')
  const config = require('../config.json')
  const app = express()

  // Hello World
  app.get('/', (req, res) => res.send('Hello World!'))

  // Listen
  app.listen(5000, () => logger.info(`Listening on port ${config.port}`))
}
