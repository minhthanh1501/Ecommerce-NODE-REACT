const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const response = await Brand.create(req.body);

  return res.json({
    success: response ? true : false,
    createCategory: response ? response : "Cannot create brand",
  });
});

const getBrand = asyncHandler(async (req, res) => {
  const response = await Brand.find().select("title _id");

  return res.json({
    success: response ? true : false,
    createCategory: response ? response : "Cannot create brand",
  });
});

const updateBrand= asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await Brand.findByIdAndUpdate(
    bcid,
    req.body,
    { new: true }
  );

  return res.json({
    success: response ? true : false,
    createCategory: response ? response : "Cannot update brand",
  });
});


const deleteBrand = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const response = await Brand.findByIdAndDelete(bcid)
  
    return res.json({
      success: response ? true : false,
      createCategory: response ? response : "Cannot delete brand",
    });
  });

module.exports = { createBrand,deleteBrand,updateBrand,getBrand };
