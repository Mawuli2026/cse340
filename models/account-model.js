const pool = require("../database")

/* *********************
 * Register New Account
 ********************* */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES 
        ($1, $2, $3, $4, 'Client') 
      RETURNING *`
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ])
    return result.rows[0]
  } catch (error) {
    console.error("registerAccount error:", error.message)
    return null
  }
}

/* **********************
 * Check if Email Exists
 ********************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount > 0
  } catch (error) {
    console.error("checkExistingEmail error:", error.message)
    return false
  }
}

/* *****************************
 * Get Account by Email
 ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT 
        account_id, account_firstname, account_lastname, 
        account_email, account_type, account_password 
      FROM account 
      WHERE account_email = $1`
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error:", error.message)
    return null
  }
}

/* *****************************
 * Get Account by ID
 ***************************** */
async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1"
    const data = await pool.query(sql, [account_id])
    return data.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error.message)
    return null
  }
}

/* *****************************
 * Update Account Info (name/email)
 ***************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE account 
      SET account_firstname = $1, account_lastname = $2, account_email = $3 
      WHERE account_id = $4 
      RETURNING *`
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("updateAccount error:", error.message)
    return null
  }
}

/* *****************************
 * Update Account Password
 ***************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account 
      SET account_password = $1 
      WHERE account_id = $2 
      RETURNING *`
    const data = await pool.query(sql, [hashedPassword, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("updatePassword error:", error.message)
    return null
  }
}

// Export all functions
module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword
}

