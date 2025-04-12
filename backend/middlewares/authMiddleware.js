// Example middleware for authentication
module.exports = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }
  
    // Add token verification logic here
  
    next();
  };
  