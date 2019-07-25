const _ = require('lodash')
const express = require('express')
const router = express.Router()
const MessageDao = require('../dao/message')
const TagDao = require('../dao/tag')
const websocket = require('../websocket')

router.get('/', function(req, res, next) {
  const from = parseInt(req.query.from || 1)
  const size = parseInt(req.query.size || 10)
  const filters = _.pick(req.query, ['toMobile', 'tag'])
  const { messages, total } = MessageDao.getAll({ from, size, ...filters })
  res.send({ messages, total })
})

router.get('/tags', function (req, res, next) {
  const tags = TagDao.getAll({ type: 'Message' }).map(tag => tag.name)
  res.send({ tags })
})

router.post('/', function(req, res, next) {
  const messageParams = req.body.message
  const message = MessageDao.create(messageParams)
  res.status(201).send({ message })
  websocket.broadcast({
    event: 'NewMessage',
    data: message
  })
})

module.exports = router

