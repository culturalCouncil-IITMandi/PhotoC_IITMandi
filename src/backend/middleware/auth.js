const authMiddleware = (req, res, next) => {

    if (req.headers['x-api-key'] !== process.env.AUTH) {
      return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
    }
  
    next();
  };
  
  export default authMiddleware;
  

// NOTE TO SELF: REDO THIS WITH JWT TOKENS