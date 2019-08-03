const db = require('./db')

const getAllStatement = (whereClause = '', havingClause = '') => db.prepare(`
  SELECT messages.*
  FROM messages
  LEFT JOIN tags on tags.targetType = 'Message' AND tags.targetId = messages.id
  ${whereClause}
  GROUP BY messages.id
  ${havingClause}
  ORDER BY createdAt desc
  LIMIT @limit OFFSET @offset
`)
const getTotalStatement = (whereClause = '', havingClause = '') => db.prepare(`
  SELECT count(*) as total from (
    SELECT messages.id
    FROM messages
    LEFT JOIN tags on tags.targetType = 'Message' AND tags.targetId = messages.id
    ${whereClause}
    GROUP BY messages.id
    ${havingClause}
  )
`)
const getOneStatement = db.prepare('SELECT * FROM messages WHERE id = ?')
const insertStatement = db.prepare('INSERT INTO messages(toMobile, content) VALUES (@toMobile, @content)')

const getToMobilesStatement = db.prepare(`
  SELECT toMobile
  from messages
  WHERE toMobile LIKE @filter
  GROUP BY toMobile
  ORDER BY createdAt desc
  LIMIT @limit
`)

const getAllTagsStatement = db.prepare(`SELECT distinct(name) from tags WHERE targetType = 'Message'`)
const getTagsOfMessageStatement = db.prepare(`SELECT * FROM tags WHERE targetType = "Message" and targetId = ?`)
const insertTagStatement = db.prepare(`INSERT INTO tags(name, targetType, targetId)
  VALUES (@name, 'Message', @targetId)`)

const getAll = db.transaction(({ from = 1, size = 10, ...filters }) => {
  const whereClause = buildWhereClause(filters)
  const havingClause = buildHavingClause(filters)
  const messages = getAllStatement(whereClause, havingClause).all({ ...filters, limit: size, offset: from - 1 })
  const { total } = getTotalStatement(whereClause, havingClause).get(filters) || { total: 0 }

  messages.forEach(message => message.tags = getTagsOfMessage(message.id))
  return { messages, total }
})

const getOne = id => {
  const message = getOneStatement.get(id)
  message.tags = getTagsOfMessage(id)
  return message
}

const create = ({ tags = [], ...params }) => {
  const { lastInsertRowid: messageId } = insertStatement.run(params)
  insertTags(messageId, tags)
  return getOne(messageId)
}

const getToMobiles = ({ filter }) => {
  return getToMobilesStatement.all({ filter: `%${filter}%`, limit: 10 }).map(row => row.toMobile)
}

const getTags = () => {
  return getAllTagsStatement.all().map(row => row.name)
}

function getTagsOfMessage (messageId) {
  return getTagsOfMessageStatement.all(messageId).map(tag => tag.name)
}

function insertTags (messageId, tags) {
  for (const tag of tags) {
    insertTagStatement.run({ name: tag, targetId: messageId })
  }
}

function buildWhereClause (filters) {
  const whereConditions = []
  if (filters.toMobile) {
    whereConditions.push('messages.toMobile = @toMobile')
  }
  if (filters.tags) {
    const tagsString = filters.tags.map(tag => `'${tag}'`).join(',')
    whereConditions.push(`tags.name in (${tagsString})`)
  }
  if (filters.createdAtFrom) {
    whereConditions.push('createdAt >= @createdAtFrom')
  }
  if (filters.createdAtTo) {
    whereConditions.push('createdAt <= @createdAtTo')
  }
  return whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
}

function buildHavingClause (filters) {
  if (filters.tags) {
    return `HAVING count(tags.id) = ${filters.tags.length}`
  }
  return ''
}

module.exports = {
  getAll,
  create,
  getToMobiles,
  getTags
}

