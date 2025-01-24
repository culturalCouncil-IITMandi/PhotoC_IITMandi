import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

    if (!req.headers['x-api-key']) {
      return res.status(401).json({ message: 'API key not found' });
    }

    try {
      const decoded = jwt.verify(req.headers['x-api-key'], process.env.JWT_TOKEN);
      next();
    } catch (err) {
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  
  };
  
  export default authMiddleware;