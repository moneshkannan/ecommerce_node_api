const express = require('express');
const { createUser, loginUser, getAllUser, getUser, deleteUser, updateUser, blockUser, unBlockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken } = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router  = express.Router();

router.post("/register", createUser)
router.post("/login", loginUser)
router.put("/password", authMiddleware, updatePassword)
router.post("/reset-password-token", forgotPasswordToken)
router.get("/all-users", getAllUser)
router.get("/refresh", handleRefreshToken)
router.get("/logout", logout)
router.get("/:id", authMiddleware,isAdmin,getUser)
router.delete("/:id",deleteUser)
router.put("/edit-user", authMiddleware, updateUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser)

module.exports = router;