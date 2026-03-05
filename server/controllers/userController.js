const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const { decode } = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`Received registration: name=${name}, email=${email}`);

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters long",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(" User saved:", savedUser);

    const refreshToken = generateRefreshToken(savedUser._id);

    savedUser.refreshToken = refreshToken;
    await savedUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, 
    });

    const accessToken = generateAccessToken(savedUser._id);
    console.log(" JWT accessToken generated:", accessToken);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    console.error(" Registration error:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  console.log("login controller is called");
  try {
    const { email, password } = req.body;
    console.log("Received:", email, password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(existingUser._id);
    console.log("generating access token in login : ", accessToken);

    const refreshToken = generateRefreshToken(existingUser._id);

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, 
    });
    
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
      accessToken, 
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshAccessToken = async (req, res) => {
  console.log(" refresh token controller is called");

  try {
    if (req.cookies?.jwt) {
      const refreshToken = req.cookies.jwt;

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Token mismatch" });
      }

      const accessToken = generateAccessToken(user._id);

      return res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken,
      });
    } else {
      return res.status(401).json({ message: "Refresh token cookie missing" });
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

const logOutUser = async (req, res) => {
  try {
    if (req.cookie?.jwt) {
      return res.sendStatus(204);
    }

    const refreshToken = req.cookies.jwt;

    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.status(200).json({message: "user logged out successfully"})
  } catch (error) {

    res.status(404).json({message: "logout Unsuccessful"})
  }
};

const uploadImage = async (req, res) => {
  console.log("uploadImage controller called");

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const result = await User.findOneAndUpdate(
      { email },
      { profileImage: imageUrl },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated image URL:", result.profileImage);

    res.json({
      message: "Profile image uploaded successfully",
      imageUrl: imageUrl,
      user: {
        _id: result._id,
        name: result.name,
        email: result.email,
        profileImage: result.profileImage
      }
    });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Server error while saving image" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, id } = req.body;
    console.log("Update user request:", { name, email, id });

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingUser = await User.findOne({ 
      email: email.trim().toLowerCase(),
      _id: { $ne: id }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
        },
      },
      { new: true }
    );

    console.log("User updated successfully:", updated._id);

    res.status(200).json({ 
      message: "Profile updated successfully", 
      user: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        profileImage: updated.profileImage
      }
    });
  } catch (error) {
    console.error("Update user error:", error.message);
    console.error("Stack:", error.stack);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  uploadImage,
  refreshAccessToken,
  logOutUser,
  updateUser
};
