const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool Setup
 * Uses SSL for production (Render) and logs queries in development.
 * *************** */
let pool;

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Needed for local development
    },
  });

  // Added for troubleshooting queries in development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query", { text });
        return res;
      } catch (error) {
        console.error("error in query", { text, error });
        throw error;
      }
    },
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Render
    },
  });

  module.exports = {
    async query(text, params) {
      return pool.query(text, params);
    },
  };
}
