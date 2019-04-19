var express = require('express')
var router = express.Router()
var EmailDao = require('../dao/email')

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

router.post('/', function(req, res, next) {
  EmailDao.create(req.body, function (err) {
    if (err) {
      console.error('在数据库中创建邮箱失败', err)
      res.status(500).send({ error: err })
    } else {
      res.status(201).send('created')
    }
  })
})

module.exports = router
