var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/dev.sqlite3');

function getAll (callback) {
  db.all("SELECT * FROM email", function(err, rows) {
    if (err) {
      callback && callback(err);
    } else {
      callback && callback(null, rows);
    }
  });
}

function create (email, callback) {
  db.run('INSERT INTO email(content, createdAt) VALUES (?, ?)', [email.content, email.createdAt], function (err) {
    if (err) {
      callback && callback(err);
    } else {
      callback && callback(null);
    }
  });
}

module.exports = {
  getAll: getAll,
  create: create
}

