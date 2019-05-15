const EmailDao = require('../dao/email')
const MessageDao = require('../dao/message')

EmailDao.create({
  toAddress: 'lily@example.com',
  fromAddress: 'lucy@example.com',
  content: 'none'
}, function (err) {
  console.log(err)
})

MessageDao.getOne({ id: 1 }, function (err, message) {
  console.log(err, message)
})

