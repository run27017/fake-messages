const DB = require('./db')

function getListWithTotal (options, callback) {
  const { from = 1, size = 10 } = options
  const output = {}
  const db = DB.create()
  db.serialize(() => {
    const sql = `SELECT id, fromName, fromAddress, toName, toAddress, subject, type, content, createdAt 
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

function getOne (id, callback) {
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

function create (
  {
    fromName,
    fromAddress,
    toName,
    toAddress,
    subject,
    type = 'text',
    content
  }, 
  callback
) {
  DB.wrap(db => {
    db.run('INSERT INTO email(fromName, fromAddress, toName, toAddress, subject, type, content) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [fromName, fromAddress, toName, toAddress, subject, type, content], 
      function (err) {
        if (err) {
          callback && callback(err)
        } else {
          callback && callback(null, this.lastID)
        }
      }
    )
  })
}

module.exports = {
  getListWithTotal,
  getOne,
  create
}

