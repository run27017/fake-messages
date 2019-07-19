const DB = require('./db')
const Database = require('better-sqlite3')
const db = new Database('db/default.sqlite3', { verbose: console.log })

function getListWithTotal (options, callback) {
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

