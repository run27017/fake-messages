const db = require('./db')

const getAllStatement = db.prepare('SELECT * FROM emails ORDER BY createdAt desc LIMIT ? OFFSET ?')
const getOneStatement = db.prepare('SELECT * FROM emails WHERE id = ?')
const getTotalStatement = db.prepare('SELECT count(*) AS total FROM emails')
const insertStatement = db.prepare(`INSERT INTO emails(fromName, fromAddress, toName, toAddress, subject, type, content)
  VALUES (@fromName, @fromAddress, @toName, @toAddress, @subject, @type, @content)`)

const getTagsStatement = db.prepare(`SELECT * FROM tags WHERE targetType = "Project" and targetId = ?`)
const insertTagStatement = db.prepare(`INSERT INTO tags(name, targetType, targetId)
  VALUES (@name, 'Project', @targetId)`)

function getAll (options) {
  const { from = 1, size = 10 } = options
  const emails = getAllStatement.all(size, from - 1)
  for (const email of emails) {
    email.tags = getTags(email.id)
  }
  const { total } = getTotalStatement.get()
  return { emails, total }
}

function getOne (id) {
  const email = getOneStatement.get(id)
  email.tags = getTags(id)
  return email
}

function create ({ tags, ...params }) {
  const { lastInsertRowid } = insertStatement.run(params)
  for (const tag of tags) {
    insertTagStatement.run({ name: tag, targetId: lastInsertRowid })
  }
  return getOne(lastInsertRowid)
}

function getTags (emailId) {
  return getTagsStatement.all(emailId).map(tag => tag.name)
}

module.exports = {
  getAll,
  getOne,
  create
}

