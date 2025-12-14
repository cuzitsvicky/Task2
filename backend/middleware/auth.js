import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireTrainer = (req, res, next) => {
  if (req.userRole !== 'trainer') {
    return res.status(403).json({ message: 'Access denied. Trainer role required.' });
  }
  next();
};

export const requireUser = (req, res, next) => {
  if (req.userRole !== 'user') {
    return res.status(403).json({ message: 'Access denied. User role required.' });
  }
  next();
};
