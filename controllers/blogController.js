const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const validateMongoDbId = require('../utils/validateMongoDbId')
const asyncHandler = require('express-async-handler')

const createBlog = asyncHandler(async (req, res) =>{
    try{
        const newBlog = await Blog.create(req.body)
        return res.json(newBlog)
    }catch(err){
        throw new Error(err)
    }
})

const updateBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true})
        return res.json(updateBlog)
    }catch(err){
        throw new Error(err)
    }
})

const getBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params
    try{
        const getBlog = await Blog.findById(id)
        await Blog.findByIdAndUpdate(
            id,{$inc:{numViews:1}},{new: true}
        )
        return res.json(getBlog)
    }catch(err){
        throw new Error(err)
    }
})

const getAllBlogs = asyncHandler(async (req, res) =>{
    const {id} = req.params
    try{
        const getAllBlogs = await Blog.find()
        return res.json(getAllBlogs)
    }catch(err){
        throw new Error(err)
    }
})

const deleteBlog = asyncHandler(async (req, res) =>{
    const {id} = req.params
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id)
        return res.json(deleteBlog)
    }catch(err){
        throw new Error(err)
    }
})

module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog
}