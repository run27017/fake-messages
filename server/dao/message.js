const DB = require('./db')

function getListWithTotal (options, callback) {
  const { from = 1, size = 10 } = options
  let output = {}
  let error = null
  const db = DB.create()
  db.serialize(() => {
    const sql = `SELECT * FROM messages ORDER BY createdAt DESC LIMIT ? OFFSET ?`
    db.all(sql, [size, from - 1], function(err, messages) {
      if (err) {
        error = err
      } else {
        output.messages = messages
      }
    })
    db.get('SELECT count(*) as count FROM messages', function (err, { count }) {
      if (err) {
        error = err
      } else {
        output.total = count
      }
    })
  })
  db.close(() => {
    if (error) {
      callback && callback(error)
    } else {
      callback && callback(null, output.messages, output.total)
    }
  })
}

function getOne (id, callback) {
  DB.wrap(db => {
    db.get('SELECT * from messages WHERE id = ?', id, function (err, message) {
      if (err) {
        callback(err)
      } else {
        callback(null, message)
      }
    })
  })
}

function create (
  {
    toMobile,
    content
  }, 
  callback
) {
  DB.wrap(db => {
    db.run('INSERT INTO messages(toMobile, content) VALUES (?, ?)', 
      [toMobile, content], 
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

