const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { options } = require("../routes/user");

// ####### Admin Permission ########
const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing Input");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);

  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});

// Filtering, sorting & pagination
const getAllProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  console.log(queries);
  // Tach cac field dac biet ra khoi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Format lai cac operators cho dung syntax cua mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  console.log(formatedQueries);

  // Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  let queryCommand = Product.find(formatedQueries);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  // Limit: so object lay ve 1 lan goi api
  // skip: 2
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  // Execute query
  // so luong san pham thoa man dieu kien !== so luong san pham tra ve 1 lan goi API
  queryCommand.exec(async (error, response) => {
    if (error) throw new Error(error.message);
    const counts = await Product.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Cannot get Products",
    });
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body);

  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct
      ? "Updated Product"
      : "Cannot update products",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);

  return res.status(200).json({
    success: deletedProduct ? true : false,
    deletedProduct: deletedProduct
      ? "Deleted Product"
      : "Cannot delete product",
  });
});

//####### User Permission ##########
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);

  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { star, comment, pid } = req.body
  if (!star || !pid) throw new Error('Missing Input')
  
  const ratingProduct = await Product.findById(pid)
  const alreadyRating = ratingProduct?.ratings.find(el => el.postedBy.toString() === _id)
//   console.log({alreadyRating})
  console.log(alreadyRating)
  if (alreadyRating) {
    // update star & comment
    await Product.updateOne({
        ratings: { $elemMatch: alreadyRating}
    },{
        $set: { "ratings.$.star" : star, "ratings.$.comment" : comment }
    }, {new: true})
  } else{
    // add star & comment
    await Product.findByIdAndUpdate(pid, {
        $push: {ratings: {star,comment,postedBy: _id}}
    }, {new : true})
  }

  // Sum ratings star
  const updatedProduct = await Product.findById(pid)
  const ratingsCount = updatedProduct.ratings.length
  const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + el.star, 0)
  updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingsCount) / 10

  await updatedProduct.save()

  return res.status(200).json({
    success: true,
    mes: "Ratings success!",
    updatedProduct
  })
})

// const test = asyncHandler(async (req, res) => {
//   const result = await Product.findById(req.query.pid).select("ratings totalRatings")
  
// //   result.ratings.map((item,index) =>{
// //     console.log(item.star)
// //   })
    
 
//   return res.status(200).json({
//     success: result ? true: false,
//     result : result.ratings[0].star
//   })
// })

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  ratings,
};
