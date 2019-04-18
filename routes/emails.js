var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

function getEmails (callback) {
  var db = new sqlite3.Database('db/dev.sqlite3');

  db.all("SELECT * FROM email", function(err, rows) {
    if (err) {
      callback(err);
    } else {
      callback && callback(null, rows);
    }
  });

  db.close();
}

/* GET emails listing. */
router.get('/', function(req, res, next) {
  getEmails(function (err, emails) {
    if (err) {
      console.error('从数据库中好获取邮箱列表失败', err)
      res.status(500).send({ error: err });
    } else {
      res.send(emails);
    }
  });
});

module.exports = router;
