const pool = require("../database");

async function createReview(account_id, inv_id, review_text) {
  const sql = `
    INSERT INTO review (account_id, inv_id, review_text)
    VALUES ($1, $2, $3)
    RETURNING *`;
  const result = await pool.query(sql, [account_id, inv_id, review_text]);
  return result.rows[0];
}

async function getReviewsByVehicle(inv_id) {
  const sql = `
    SELECT r.review_id, r.review_text, r.review_date, a.account_firstname, a.account_lastname
    FROM review r
    JOIN account a ON r.account_id = a.account_id
    WHERE inv_id = $1
    ORDER BY r.review_date DESC`;
  const result = await pool.query(sql, [inv_id]);
  return result.rows;
}

async function getReviewsByAccount(account_id) {
  const sql = `
    SELECT r.*, i.inv_make, i.inv_model
    FROM review r
    JOIN inventory i ON r.inv_id = i.inv_id
    WHERE r.account_id = $1
    ORDER BY r.review_date DESC`;
  const result = await pool.query(sql, [account_id]);
  return result.rows;
}

async function deleteReview(review_id, account_id) {
  const sql = "DELETE FROM review WHERE review_id = $1 AND account_id = $2 RETURNING *";
  const result = await pool.query(sql, [review_id, account_id]);
  return result.rows[0];
}

async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT r.review_text, r.review_date, a.account_firstname, a.account_lastname
      FROM review r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
}

module.exports = {
  createReview,
  getReviewsByVehicle,
  getReviewsByAccount,
  deleteReview,
  getReviewsByInvId 
}
