const jwt = require('jsonwebtoken');
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !decoded.role) {
      throw new Error('Invalid token payload');
    }
    req.user = {
      id: decoded.id,
      role: decoded.role,
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
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        message: 'Forbidden: User role not found' 
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: ${req.user.role} role not authorized for this action`
      });
    }

    next();
  };
};
exports.isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Forbidden: Admin access required' });
};

exports.isCustomer = (req, res, next) => {
  if (req.user?.role === 'customer') return next();
  res.status(403).json({ message: 'Forbidden: Customer access required' });
};