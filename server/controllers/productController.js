const Product = require("../models/product")
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

// Admin Permission
const createProduct = asyncHandler(async(req, res) => {
    if(Object.keys(req.body).length === 0) throw new Error('Missing Input')
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)

    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})

// Filtering, sorting & pagination
const getAllProducts = asyncHandler(async(req, res) => {
    
    const products = await Product.find()
    

    return res.status(200).json({
        success: products ? true : false,
        productData: products ? products : 'Cannot get all products'
    })
})

const updateProduct = asyncHandler(async(req, res) => {
    const { pid } = req.params
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body)
    

    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? 'Updated Product' : 'Cannot update products'
    })
})

const deleteProduct = asyncHandler(async(req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    

    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? 'Deleted Product' : 'Cannot delete product'
    })
})



// User Permission
const getProduct = asyncHandler(async(req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    

    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})


module.exports = {
    createProduct,getProduct,getAllProducts,updateProduct,deleteProduct
}