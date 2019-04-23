const DB = require('./db')

function getListWithTotal (options, callback) {
  const { from = 1, size = 10 } = options
  const output = {}
  const db = DB.create()
  db.serialize(() => {
    const sql = `SELECT id, fromName, fromAddress, toName, toAddress, subject, substr(content, 1, 80) content, createdAt 
      FROM email ORDER BY createdAt DESC LIMIT ? OFFSET ?`
    db.all(sql, [size, from - 1], function(err, emails) {
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

function getOne (options, callback) {
  const { id } = options
  DB.wrap(db => {
    db.get('SELECT * from email WHERE id = ?', id, function (err, email) {
      if (err) {
        callback(err)
      } else {
        callback(null, email)
      }
    })
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
  getOne,
  create: create
}

