const express = require('express')
const router = express.Router()
const MessageDao = require('../dao/message')
const websocket = require('../websocket')

router.get('/', function(req, res, next) {
  const from = parseInt(req.query.from || 1)
  const size = parseInt(req.query.size || 10)
  MessageDao.getListWithTotal({ from, size }, function (err, messages, total) {
    if (err) {
      console.error('从数据库中获取短信列表失败', err)
      res.status(500).send({ error: err })
    } else {
      res.send({ messages, total })
    }
  })
})

router.post('/', function(req, res, next) {
  if (!req.body.toMobile) {
    res.status(400).send({ error: 'toMobile不能为空白' })
  } else {
    MessageDao.create(req.body, function (err, id) {
      if (err) {
        console.error('在数据库中创建短信失败', err)
        res.status(500).send({ error: err })
      } else {
        MessageDao.getOne(id, function (err, message) {
          if (err) {
            console.error('从数据库中获取短信失败', err)
            res.status(500).send({ error: err })
          } else {
            res.status(201).send(message)
            websocket.broadcast({
              event: 'MessageReceived',
              data: message
            })
          }
        })
      }
    })
  }
})

module.exports = router

