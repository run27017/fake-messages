const Database = require('better-sqlite3')
const db = new Database('db/default.sqlite3', { verbose: console.log })

const getAllStatement = db.prepare('select * from emails order by createdAt desc limit ? offset ?')
const getOneStatement = db.prepare('select * from emails where id = ?')
const getTotalStatement = db.prepare('select count(*) as total from emails')
const insertStatement = db.prepare(`insert into emails(fromName, fromAddress, toName, toAddress, subject, type, content)
  values(@fromName, @fromAddress, @toName, @toAddress, @subject, @type, @content)`)

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

