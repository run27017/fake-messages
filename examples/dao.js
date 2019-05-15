const EmailDao = require('../dao/email')

EmailDao.create({
  toAddress: 'lily@example.com',
  fromAddress: 'lucy@example.com',
  content: 'none'
}, function (err) {
  console.log(err)
})

