const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')

const createProduct = asyncHandler(async(req, res) => {
    try{
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    }catch(err){
        throw new Error(err)
    }
})

const getProduct = asyncHandler(async(req, res) => {
    const {id} = req.params
    try{
        const findProduct = await Product.findById(id)
        return res.json(findProduct)
    }catch(err){
        throw new Error(err)
    }
})

const getAllProduct = asyncHandler(async (req, res) =>{
    try{
        const getProducts = await Product.find();
        return res.json(getProducts)
    }catch(err){
        throw new Error(err)
    }
})

module.exports = {
    createProduct,
    getProduct,
    getAllProduct
}