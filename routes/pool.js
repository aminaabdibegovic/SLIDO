const Pool = require('pg').Pool
const pool = new Pool({
    user: 'dlmgzyux', //env var: PGUSER
    database: 'dlmgzyux', //env var: PGDATABASE
    password: '9jZ8oHyNwvRkU3sZz45vqHFcQ-Cxd-Wc', //env var: PGPASSWORD
    host: 'mouse.db.elephantsql.com', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 100, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
})
module.exports=pool;