const _ = require('lodash')
const db = require('./db')

// HACK: 同时返回所有 tags
const getAllStatement = (whereClause = '', havingClause = '') => db.prepare(`
  SELECT emails.*
  FROM emails
  LEFT JOIN tags on tags.targetType = 'Email' AND tags.targetId = emails.id
  ${whereClause}
  GROUP BY emails.id
  ${havingClause}
  ORDER BY createdAt desc
  LIMIT @limit OFFSET @offset
`)
const getTotalStatement = (whereClause = '', havingClause = '') => db.prepare(`
  SELECT count(*) as total from (
    SELECT emails.id
    FROM emails
    LEFT JOIN tags on tags.targetType = 'Email' AND tags.targetId = emails.id
    ${whereClause}
    GROUP BY emails.id
    ${havingClause}
  )
`)
const getOneStatement = db.prepare('SELECT * FROM emails WHERE id = ?')
const insertStatement = db.prepare(`INSERT INTO emails(fromName, fromAddress, toName, toAddress, subject, type, content)
  VALUES (@fromName, @fromAddress, @toName, @toAddress, @subject, @type, @content)`)

const getFromAddressesStatement = db.prepare(`
  SELECT fromAddress
  from emails
  WHERE fromAddress LIKE @filter
  GROUP BY fromAddress
  ORDER BY createdAt desc
  LIMIT @limit
`)
const getToAddressesStatement = db.prepare(`
  SELECT toAddress
  from emails
  WHERE toAddress LIKE @filter
  GROUP BY toAddress
  ORDER BY createdAt desc
  LIMIT @limit
`)

const getAllTagsStatement = db.prepare(`SELECT distinct(name) from tags WHERE targetType = 'Email'`)
const getTagsOfEmailStatement = db.prepare(`SELECT * FROM tags WHERE targetType = "Email" and targetId = ?`)
const insertTagsStatement = db.prepare(`INSERT INTO tags(name, targetType, targetId)
  VALUES (@name, 'Email', @targetId)`)

const getAll = db.transaction(({ from = 1, size = 10, ...filters }) => {
  const whereClause = buildWhereClause(filters)
  const havingClause = buildHavingClause(filters)
  const filterParams = buildFilterParams(filters)
  const emails = getAllStatement(whereClause, havingClause).all({ ...filterParams, limit: size, offset: from - 1 })
  const { total } = getTotalStatement(whereClause, havingClause).get(filterParams) || { total: 0 }
  
  emails.forEach(email => email.tags = getTagsOfEmail(email.id))
  return { emails, total }
})

const getOne = db.transaction(id => {
  const email = getOneStatement.get(id)
  email.tags = getTagsOfEmail(id)
  return email
})

const create = db.transaction(({ tags = [], ...params }) => {
  const { lastInsertRowid: emailId } = insertStatement.run(params)
  insertTags(emailId, tags)
  return getOne(emailId)
})

const getFromAddresses = ({ filter }) => {
  return getFromAddressesStatement.all({ filter: `%${filter}%`, limit: 10 }).map(row => row.fromAddress)
}

const getToAddresses = ({ filter }) => {
  return getToAddressesStatement.all({ filter: `%${filter}%`, limit: 10 }).map(row => row.toAddress)
}

const getTags = () => {
  return getAllTagsStatement.all().map(row => row.name)
}

function getTagsOfEmail (emailId) {
  return getTagsOfEmailStatement.all(emailId).map(tag => tag.name)
}

function insertTags (emailId, tags) {
  for (const tag of tags) {
    insertTagsStatement.run({ name: tag, targetId: emailId })
  }
}

function buildWhereClause (filters) {
  const whereConditions = []
  if (filters.fromAddress) {
    whereConditions.push('emails.fromAddress = @fromAddress')
  }
  if (filters.toAddress) {
    whereConditions.push('emails.toAddress = @toAddress')
  }
  if (filters.createdAtFrom) {
    whereConditions.push('createdAt >= @createdAtFrom')
  }
  if (filters.createdAtTo) {
    whereConditions.push('createdAt <= @createdAtTo')
  }
  if (filters.tags) {
    const tagParams = new Array(filters.tags.length).fill(0).map((_, index) => `@tag${index + 1}`)
    whereConditions.push(`tags.name in (${tagParams.join(', ')})`)
  }
  return whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
}

function buildHavingClause (filters) {
  if (filters.tags) {
    return `HAVING count(tags.id) = ${filters.tags.length}`
  }
  return ''
}

function buildFilterParams (filters) {
  const filterParams = Object.assign({}, filters)
  if (filters.tags) {
    const tagParams = filters.tags.map((tag, index) => [`tag${index + 1}`, tag])
    Object.assign(filterParams, _.fromPairs(tagParams))
  }
  return filterParams
}

module.exports = {
  getAll,
  getOne,
  create,
  getToAddresses,
  getFromAddresses,
  getTags
}

