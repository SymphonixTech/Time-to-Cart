import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.zxcsdasd;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.admin;
    console.log("token: ");
    console.log(token);
    if(!token) return res.status(401).json({ error: 'Not authenticated' });
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("Decoded Token: ");
    console.log(decoded)
    const user = await User.findById(decoded.id).select('-password');
    console.log("User: ");
    console.log(user);
    if(user.role !== 'admin') return res.status(401).json({ error: 'Not authorized' });
    next();
  }
  catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
