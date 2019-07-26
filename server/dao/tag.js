const db = require('./db')

const getAllStatement = whereClause => db.prepare(`SELECT name from tags WHERE targetType = @type GROUP BY name`)

const getAll = ({ type }) => {
  return getAllStatement().all({ type }).map(row => row.name)
}

module.exports = {
  getAll
}

