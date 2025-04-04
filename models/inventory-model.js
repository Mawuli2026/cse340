 const pool = require("../database/")

/* ****************************
* Get all classification data
**************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 * Get all inventory items and classification_name by classification_id
 ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1
        `, [classification_id]);  // FIXED
        return data.rows;
    } catch (error) {
      console.error("getInventoryByClassificationId error " + error)
    }
}

/* ***************************
 *  Get vehicle details by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const sql = `
        SELECT inv_make, inv_model, inv_year, inv_price, inv_miles AS inv_mileage, inv_description, inv_image 
        FROM inventory 
        WHERE inv_id = $1
    `;
    const result = await pool.query(sql, [inv_id]);
    if (result.rows.length === 0) {
        throw new Error(`No vehicle found with ID ${inv_id}`);
    }
    return result.rows[0];  // Return the first matching record
  } catch (error) {
    console.error("getVehicleById error:", error);
    throw error;
  }
}


module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById }
