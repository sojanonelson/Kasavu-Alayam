const jwt = require('jsonwebtoken');

// Base protection middleware - verifies JWT and attaches user to request
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validate token payload structure
    if (!decoded.id || !decoded.role) {
      throw new Error('Invalid token payload');
    }
    
    // Attach user to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      // Add any other relevant user data from the token
    };
    
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired - please login again' });
    }
    
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

// Role verification middleware
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        message: 'Forbidden: User role not found' 
      });
    }

    // Check if user's role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: ${req.user.role} role not authorized for this action`
      });
    }

    next();
  };
};

// Specific role checkers (optional but convenient)
exports.isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Forbidden: Admin access required' });
};

exports.isCustomer = (req, res, next) => {
  if (req.user?.role === 'customer') return next();
  res.status(403).json({ message: 'Forbidden: Customer access required' });
};