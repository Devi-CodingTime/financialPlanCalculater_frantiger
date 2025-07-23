import jwt from 'jsonwebtoken';
export const requireSignIn = (req, res, next) => {
   try { 
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   console.log("decoded", decoded);
   
    if (!decoded?.userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.log(decoded, "decoded");
    
    req.user = { id: decoded.userId, role: decoded.role }; // Assuming role is part of the token
    // req.user = decoded;
    next();
    }
    catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export const requireAdmin = (req, res, next) => {
  console.log(req.user);
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};