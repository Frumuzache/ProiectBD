const oracledb = require('oracledb');
require('dotenv').config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

async function initialize() {
  await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    poolAlias: 'default'
  });
}

async function execute(sql, binds = []) {
  let conn;
  try {
    conn = await oracledb.getConnection('default');
    return await conn.execute(sql, binds);
  } finally {
    if (conn) await conn.close();
  }
}

module.exports = { initialize, execute };