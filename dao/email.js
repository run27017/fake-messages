var dbWrap = require('./db').wrap

function getAll (callback) {
  dbWrap(db => {
    db.all("SELECT * FROM email ORDER BY createdAt DESC", function(err, rows) {
      if (err) {
        callback && callback(err);
      } else {
        callback && callback(null, rows);
      }
    })
  })
}

function create (email, callback) {
  dbWrap(db => {
    db.run('INSERT INTO email(fromName, fromAddress, toName, toAddress, subject, content) VALUES (?, ?, ?, ?, ?, ?)', 
      [email.fromName, email.fromAddress, email.toName, email.toAddress, email.subject, email.content], 
      function (err) {
        if (err) {
          callback && callback(err);
        } else {
          callback && callback(null);
        }
      }
    )
  })
}

module.exports = {
  getAll: getAll,
  create: create
}

