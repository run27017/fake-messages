const DB = require('./db')

function getListWithTotal (options, callback) {
  const db = DB.create()
  const { from = 1, size = 10 } = options
  db.all("SELECT * FROM email ORDER BY createdAt DESC LIMIT ? OFFSET ?", [size, from - 1], function(err, emails) {
    if (err) {
      callback && callback(err);
    } else {
      db.get('SELECT count(*) as count FROM email', function (err, { count }) {
        callback && callback(null, emails, count)
        DB.close(db)
      })
    }
  })
}

function create (email, callback) {
  DB.wrap(db => {
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
  getListWithTotal,
  create: create
}

