const DB = require('./db')

function getListWithTotal (options, callback) {
  const { from = 1, size = 10 } = options
  const output = {}
  const db = DB.create()
  db.serialize(() => {
    db.all("SELECT * FROM email ORDER BY createdAt DESC LIMIT ? OFFSET ?", [size, from - 1], function(err, emails) {
      if (err) {
        output.error = err
      } else {
        output.emails = emails
      }
    })
    db.get('SELECT count(*) as count FROM email', function (err, { count }) {
      if (err) {
        output.error = err
      } else {
        output.total = count
      }
    })
  })
  db.close(() => {
    if (output.error) {
      callback && callback(output.error);
    } else {
      callback && callback(null, output.emails, output.total)
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

