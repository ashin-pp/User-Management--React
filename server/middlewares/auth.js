const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require('dotenv');
// this is a middleware which is used to do the auth part of the

dotenv.config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No accessToken provided.' });
  }

  const accessToken = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.isDeleted) {
      return res.status(401).json({ message: 'User no longer available' });
    }

    console.log('User details', user);
    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.log('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid accessToken' });
  }
};

const verifyAdminToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied, accessToken not provided' });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    //catching the error
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid accessToken' });
  }
};

// ✅ Fix: Use CommonJS export style
module.exports = {
  verifyToken,
  verifyAdminToken,
};
