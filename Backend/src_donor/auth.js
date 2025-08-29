import jwt from 'jsonwebtoken';

/**
 * Very basic JWT auth for donors.
 * Expects Authorization: Bearer <token>
 * Token payload example: { id: '<donorId>', role: 'donor' }
 */
export function donorAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    if (decoded.role !== 'donor') return res.status(403).json({ error: 'Forbidden' });
    req.donorId = decoded.id;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
