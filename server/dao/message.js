const Database = require('better-sqlite3')
const db = new Database('db/default.sqlite3', { verbose: console.log })

const getAllStatement = db.prepare('select * from messages order by createdAt desc limit ? offset ?')
const getOneStatement = db.prepare('select * from messages where id = ?')
const getTotalStatement = db.prepare('select count(*) as total from messages')
const insertStatement = db.prepare('insert into messages(toMobile, content) values(@toMobile, @content)')

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

