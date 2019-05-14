const express = require('express')
const router = express.Router()

router.post('/sendWebSocketMessage', function(req, res, next) {
  const { broadcast } = require('../websocket')
  broadcast('Hello: ' + new Date().getTime())

  res.end()
})

module.exports = router

