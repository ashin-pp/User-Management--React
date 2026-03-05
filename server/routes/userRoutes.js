const express = require("express");
const user_router = express.Router();
const upload = require("../middlewares/upload");

const{registerUser,
    loginUser,
    uploadImage,
    refreshAccessToken,
    logOutUser,
    updateUser
} = require("../controllers/userController");

const { verifyToken } = require("../middlewares/auth.js");


// POST /api/users/register
user_router.post("/register", registerUser);
user_router.post("/login", loginUser);
user_router.post("/upload-image", verifyToken, upload.single('image'), uploadImage);
user_router.patch("/update-profile",verifyToken,updateUser);
user_router.post("/refresh", refreshAccessToken)
user_router.post("/logout",logOutUser)


module.exports = user_router;
