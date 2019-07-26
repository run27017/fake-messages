const _ = require('lodash')
const express = require('express')
const { body, validationResult } = require('express-validator')
const EmailDao = require('../dao/email')
const websocket = require('../websocket')

const router = express.Router()

router.get('/', function(req, res, next) {
  const from = parseInt(req.query.from || 1)
  const size = parseInt(req.query.size || 10)
  const filters = _.pick(req.query, ['fromAddress', 'toAddress', 'tag'])
  const { emails, total } = EmailDao.getAll({ from, size, ...filters })
  simplifyContent(emails)
  res.send({ emails, total })
})

router.get('/fromAddresses', function (req, res, next) {
  const { filter } = req.query
  const fromAddresses = EmailDao.getFromAddresses({ filter })
  res.send({ fromAddresses })
})

router.get('/toAddresses', function (req, res, next) {
  const { filter } = req.query
  const toAddresses = EmailDao.getToAddresses({ filter })
  res.send({ toAddresses })
})

router.get('/tags', function (req, res, next) {
  const tags = EmailDao.getTags()
  res.send({ tags })
})

// TODO: 限制id为纯数字
router.get('/:id', function(req, res, next) {
  const { id } = req.params
  const email = EmailDao.getOne(id)
  res.send({ email })
})

router.post('/', [
  body('email.toAddress').not().isEmpty(),
  body('email.fromAddress').not().isEmpty(),
  body('email.subject').not().isEmpty(),
  body('email.content').not().isEmpty(),
  body('email.tags').isArray()
], function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

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

