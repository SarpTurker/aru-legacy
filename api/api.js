/**
 * Aru
 * API
 */

module.exports = function (logger) {
  // Setup files and modules
  const express = require('express')
  const config = require('./config.json')

  const app = express()

  // Listen
  app.listen(config.port, () => logger.info(`Listening on port ${config.port}`))
}
