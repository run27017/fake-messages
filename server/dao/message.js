const db = require('./db')

const getAllStatement = db.prepare('SELECT * FROM messages ORDER BY createdAt DESC LIMIT ? OFFSET ?')
const getOneStatement = db.prepare('SELECT * FROM messages WHERE id = ?')
const getTotalStatement = db.prepare('SELECT count(*) AS total FROM messages')
const insertStatement = db.prepare('INSERT INTO messages(toMobile, content) VALUES (@toMobile, @content)')

const getTagsStatement = db.prepare(`SELECT * FROM tags WHERE targetType = "Message" and targetId = ?`)
const insertTagStatement = db.prepare(`INSERT INTO tags(name, targetType, targetId)
  VALUES (@name, 'Message', @targetId)`)

const getAll = (options) => {
  const { from = 1, size = 10 } = options
  const messages = getAllStatement.all(size, from - 1)
  messages.forEach(message => message.tags = getTags(message.id))
  const { total } = getTotalStatement.get()
  return { messages, total }
}

const getOne = id => {
  const message = getOneStatement.get(id)
  message.tags = getTags(id)
  return message
}

const create = ({ tags = [], ...params }) => {
  const { lastInsertRowid: messageId } = insertStatement.run(params)
  insertTags(messageId, tags)
  return getOne(messageId)
}

function getTags (messageId) {
  return getTagsStatement.all(messageId).map(tag => tag.name)
}

function insertTags (messageId, tags) {
  for (const tag of tags) {
    insertTagStatement.run({ name: tag, targetId: messageId })
  }
}

module.exports = {
  getAll,
  create
}

