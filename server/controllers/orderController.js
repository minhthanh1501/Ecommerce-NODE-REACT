const Order = require("../models/order");
const User = require("../models/user")
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) throw new Error("Missing inputs");

  const response = await Blog.create(req.body);

  return res.json({
    success: response ? true : false,
    createdBlog: response ? response : "can't create Order",
  });
});

module.exports = {
  createOrder,
};
