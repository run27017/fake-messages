var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

function getEmails (callback) {
  var db = new sqlite3.Database('db/dev.sqlite3');

  db.all("SELECT * FROM email", function(err, rows) {
    if (err) {
      callback && callback(err);
    } else {
      callback && callback(null, rows);
    }
  });

  db.close();
}

function createEmail (email, callback) {
  var db = new sqlite3.Database('db/dev.sqlite3');

  db.run('INSERT INTO email(content, createdAt) VALUES (?, ?)', [email.content, email.createdAt], function (err) {
    if (err) {
      callback && callback(err);
    } else {
      callback && callback(null);
    }
  });

  db.close();
}

router.get('/', function(req, res, next) {
  getEmails(function (err, emails) {
    if (err) {
      console.error('从数据库中获取邮箱列表失败', err)
      res.status(500).send({ error: err });
    } else {
      res.send(emails);
    }
  });
});

router.post('/', function(req, res, next) {
  createEmail(req.body, function (err) {
    if (err) {
      console.error('在数据库中创建邮箱失败', err)
      res.status(500).send({ error: err });
    } else {
      res.status(201).send('created');
    }
  });
});

module.exports = router;
