const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const db = {
  // Expose wrapped query for general app use
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      if (process.env.NODE_ENV === "development") {
        console.log("executed query", { text })
      }
      return res
    } catch (error) {
      console.error("error in query", { text, error })
      throw error
    }
  },
  // Expose raw pool for session middleware
  pool,
}

module.exports = db
