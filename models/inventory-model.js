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

// Add Classification
async function addClassification(name) {
  const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
  const result = await pool.query(sql, [name]);
  return result.rowCount;
}

// Add Inventory
async function addInventory(data) {
  const sql = `
    INSERT INTO inventory 
    (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`;
  const values = [
    data.inv_make,
    data.inv_model,
    data.inv_year,
    data.inv_description,
    data.inv_image,
    data.inv_thumbnail,
    data.inv_price,
    data.inv_miles,
    data.inv_color,
    data.classification_id,
  ];
  return await pool.query(sql, values);
}



module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory}
