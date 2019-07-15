const express = require('express')
const router = express.Router()

/**
 * 用于测试发送WebSocket消息，调用该接口并在Body中传入JSON数据即可传递该JSON数据给客户端。
 */
router.post('/sendWebSocketMessage', function(req, res, next) {
  const { broadcast } = require('../websocket')
  if (req.body === '') {
    broadcast('Hello: ' + new Date().getTime())
  } else {
    broadcast(req.body)
  }
  res.end('sent')
})

module.exports = router

