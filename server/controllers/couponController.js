const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing Input");
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: response ? true : false,
    createdCoupon: response ? response : "Cannot create Coupon",
  });
});

const getCoupon = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createdAt -updatedAt");

  return res.status(200).json({
    success: response ? true : false,
    createdCoupon: response ? response : "Cannot get Coupon",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing Input");
  if(req.body.expiry) req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000
  const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });

  return res.json({
    success: response ? true : false,
    createCategory: response ? response : "Cannot update Coupon",
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid, { new: true });

  return res.json({
    success: response ? true : false,
    createCategory: response ? response : "Cannot delete Coupon",
  });
});

module.exports = {
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon
};
