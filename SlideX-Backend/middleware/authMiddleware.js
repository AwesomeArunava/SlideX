import jwt from 'jsonwebtoken';
import Token from '../model/tokenModel.js';
import dotenv from 'dotenv';

dotenv.config();

const authenticateUser = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token exists in database (not revoked)
    const tokenDoc = await Token.findOne({ token, type: 'session' });
    if (!tokenDoc) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // 3. Verify JWT is valid
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // 4. Attach user to request
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Authentication failed' });
  }
};

export default authenticateUser;
