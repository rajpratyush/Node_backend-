const { Pool } = require('pg');

const pool = new Pool({
  user: '# your username for the database',
  host: '# your database host url',
  database: '# your database name',
  password: '#enter your password"',
  port: # enter your port number,
  ssl: {
    rejectUnauthorized: false,
  }
});

module.exports = pool;
