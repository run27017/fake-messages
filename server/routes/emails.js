const express = require('express')
const router = express.Router()
const EmailDao = require('../dao/email')
const websocket = require('../websocket')

router.get('/', function(req, res, next) {
  const from = parseInt(req.query.from || 1)
  const size = parseInt(req.query.size || 10)
  const { emails, total } = EmailDao.getAll({ from, size })
  simplifyContent(emails)
  res.send({ emails, total })
})

router.get('/:id', function(req, res, next) {
  const { id } = req.params
  const email = EmailDao.getOne(id)
  res.send({ email })
})

router.post('/', function(req, res, next) {
  const emailParams = req.body.email
  const email = EmailDao.create(emailParams)
  res.status(201).send({ email })
  websocket.broadcast({
    event: 'NewEmail',
    data: email
  })
})

function simplifyContent (emails) {
  emails.forEach(email => {
    if (email.type === 'text') {
      email.content = email.content.substr(0, 80)
    } else if (email.type === 'html') {
      email.content = stripHTMLTags(email.content).substr(0, 80)
    }
  })
}

function stripHTMLTags (content) {
  return content.replace(/<[^>]*>?/gm, '')
}

module.exports = router

