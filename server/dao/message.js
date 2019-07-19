const db = require('./db')

const getAllStatement = db.prepare('SELECT * FROM messages ORDER BY createdAt DESC LIMIT ? OFFSET ?')
const getOneStatement = db.prepare('SELECT * FROM messages WHERE id = ?')
const getTotalStatement = db.prepare('SELECT count(*) AS total FROM messages')
const insertStatement = db.prepare('INSERT INTO messages(toMobile, content) VALUES (@toMobile, @content)')

function getAll (options) {
  const { from = 1, size = 10 } = options
  const messages = getAllStatement.all(size, from - 1)
  const { total } = getTotalStatement.get()
  return { messages, total }
}

function create (params) {
  const { lastInsertRowid } = insertStatement.run(params)
  return getOneStatement.get(lastInsertRowid)
}

module.exports = {
  getAll,
  create
}

