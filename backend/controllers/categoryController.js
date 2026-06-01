const { findAllCategories } = require("../models/categoryModel");

const getCategories = async (req, res) => {
  const categories = await findAllCategories();
  res.status(200).json(categories);
};

module.exports = { getCategories };
