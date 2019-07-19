const db = require('./db')

const getAllStatement = db.prepare('SELECT * FROM emails ORDER BY createdAt desc LIMIT ? OFFSET ?')
const getOneStatement = db.prepare('SELECT * FROM emails WHERE id = ?')
const getTotalStatement = db.prepare('SELECT count(*) AS total FROM emails')
const insertStatement = db.prepare(`INSERT INTO emails(fromName, fromAddress, toName, toAddress, subject, type, content)
  VALUES (@fromName, @fromAddress, @toName, @toAddress, @subject, @type, @content)`)

function getAll (options) {
  const { from = 1, size = 10 } = options
  const emails = getAllStatement.all(size, from - 1)
  const { total } = getTotalStatement.get()
  return { emails, total }
}

function getOne (id) {
  const email = getOneStatement.get(id)
  return email
}

function create (params) {
  const { lastInsertRowid } = insertStatement.run(params)
  const email = getOneStatement.get(lastInsertRowid)
  return email
}

module.exports = {
  getAll,
  getOne,
  create
}

