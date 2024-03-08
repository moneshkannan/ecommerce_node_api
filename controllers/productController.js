const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const slugify = require("slugify")

const createProduct = asyncHandler(async(req, res) => {
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    }catch(err){
        throw new Error(err)
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findOneAndUpdate({_id: id}, req.body, {new: true})
        return res.json(updateProduct)
    }catch(err){
        throw new Error(err)
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params
    try{
        const deleteProduct = await Product.findByIdAndDelete(id)
        return res.json(deleteProduct)
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

        // Filtering
        const queryObj = {...req.query}
        const excludeFields = ["page", "sort", "limit", "fields"]
        excludeFields.forEach((el) => delete queryObj[el])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        let query = Product.find(JSON.parse(queryStr))
        // sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        }else{
            query = query.sort('-createdAt')
        }
        // limiting the fields
        if(req.query.fields){
            const fields = req.query.sort.split(',').join(' ')
            query = query.select(fields)
        }else{
            query = query.select("-__v")
        }
        // pagination
        const {page, limit} = req.query
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        if(req.query.page){
            const productCount = await Product.countDocuments() 
            if(skip >= productCount) throw new Error("this page does not exist")
        }
        const getProducts = await query

        return res.json(getProducts)
    }catch(err){
        throw new Error(err)
    }
})

module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
}