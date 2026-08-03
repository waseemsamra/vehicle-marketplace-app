import jwt from 'jsonwebtoken';

const getJwtSecret = () => process.env.JWT_SECRET || 'dev-secret-change-me';

// Authenticate the request: verify the bearer token and expose `req.user`
// (a polymorphic role object: { username, role, ... }).
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthenticated' });
  try {
    req.user = jwt.verify(token, getJwtSecret());
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Authorise by role claim on the token. Because roles are a first-class
// concept (User / Staff / Admin), adding a new role in the model does not
// require new guards here.
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
