const db = require('./db')

const getAllStatement = db.prepare('SELECT * FROM emails ORDER BY createdAt desc LIMIT ? OFFSET ?')
const getOneStatement = db.prepare('SELECT * FROM emails WHERE id = ?')
const getTotalStatement = db.prepare('SELECT count(*) AS total FROM emails')
const insertStatement = db.prepare(`INSERT INTO emails(fromName, fromAddress, toName, toAddress, subject, type, content)
  VALUES (@fromName, @fromAddress, @toName, @toAddress, @subject, @type, @content)`)

const getTagsStatement = db.prepare(`SELECT * FROM tags WHERE targetType = "Project" and targetId = ?`)
const insertTagStatement = db.prepare(`INSERT INTO tags(name, targetType, targetId)
  VALUES (@name, 'Project', @targetId)`)

const getAll = db.transaction(options => {
  const { from = 1, size = 10 } = options
  const emails = getAllStatement.all(size, from - 1)
  for (const email of emails) {
    email.tags = getTags(email.id)
  }
  const { total } = getTotalStatement.get()
  return { emails, total }
})

const getOne = db.transaction(id => {
  const email = getOneStatement.get(id)
  email.tags = getTags(id)
  return email
})

const create = db.transaction(({ tags = [], ...params }) => {
  const { lastInsertRowid: emailId } = insertStatement.run(params)
  insertTags(emailId, tags)
  return getOne(emailId)
})

function getTags (emailId) {
  return getTagsStatement.all(emailId).map(tag => tag.name)
}

function insertTags (emailId, tags) {
  for (const tag of tags) {
    insertTagStatement.run({ name: tag, targetId: emailId })
  }
}

module.exports = {
  getAll,
  getOne,
  create
}

