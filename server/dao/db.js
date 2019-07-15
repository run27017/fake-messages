var sqlite3 = require('sqlite3').verbose();

function create () {
  return new sqlite3.Database('db/default.sqlite3');
}

function close (db) {
  db.close()
}

function wrap (run) {
  const db = create()
  run(db)
  close(db)
}

module.exports = {
  create,
  close,
  wrap
}

