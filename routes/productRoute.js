const express = require('express');
const { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist } = require('../controllers/productController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/", authMiddleware, isAdmin,createProduct)
router.get("/", getAllProduct)
router.put("/wishlist", authMiddleware, addToWishlist)
router.get("/:id", getProduct)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)


module.exports = router