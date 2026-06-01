const pool = require("../db");

const findAllCategories = async () => {
  const [rows] = await pool.query("SELECT * FROM categories");
  return rows;
};

module.exports = { findAllCategories };
