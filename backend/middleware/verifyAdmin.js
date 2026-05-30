import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    try {
        // Grab the digital identity token sent by the frontend header
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Access Denied. No token provided.' });
        }

        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        
        // Check if the user's role is strictly 'admin'
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied. Teacher restrictions apply.' });
        }

        req.user = decoded;
        next(); // Authorization check passed! Proceed to the route handler.
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired authentication session token.' });
    }
};