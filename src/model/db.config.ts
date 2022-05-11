require('dotenv').config()
import {Pool} from 'pg'
const env = process.env
const connectionString = `postgresql://${env.user}:${env.password}@${env.host}:${env.pgport}/${env.database}`

const pool = new Pool({
    connectionString: connectionString
})

export default pool;