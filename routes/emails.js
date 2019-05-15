const express = require('express')
const router = express.Router()
const EmailDao = require('../dao/email')
const websocket = require('../websocket')

router.get('/', function(req, res, next) {
  const from = parseInt(req.query.from || 1)
  const size = parseInt(req.query.size || 10)
  EmailDao.getListWithTotal({ from, size }, function (err, emails, total) {
    if (err) {
      console.error('从数据库中获取邮箱列表失败', err)
      res.status(500).send({ error: err })
    } else {
      res.send({ emails, total })
    }
  })
})

router.get('/:id', function(req, res, next) {
  const { id } = req.params
  EmailDao.getOne({ id }, function (err, email) {
    if (err) {
      console.error('从数据库中获取邮件失败', err)
      res.status(500).send({ error: err })
    } else {
      res.send({ email })
    }
  })
})

router.post('/', function(req, res, next) {
  if (!req.body.toAddress) {
    res.status(400).send({ error: 'toAddress不能为空白' })
  } else {
    EmailDao.create(req.body, function (err, id) {
      if (err) {
        console.error('在数据库中创建邮箱失败', err)
        res.status(500).send({ error: err })
      } else {
        EmailDao.getOne({ id }, function (err, email) {
          if (err) {
            console.error('从数据库中获取邮件失败', err)
            res.status(500).send({ error: err })
          } else {
            res.status(201).send({ email })
            websocket.broadcast({
              event: 'EmailReceived',
              data: email
            })
          }
        })
      }
    })
  }
})

module.exports = router

