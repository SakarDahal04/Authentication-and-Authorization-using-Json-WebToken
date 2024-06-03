const jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtAuthMiddleware = (req, res, next) => {
    //
    // Look how the token can be passed in the authorization header because it is the common practice
    //
    const authorization = `Bearer ${req.cookies.token}`;
    console.log(authorization)

    // If token not found
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Invalid token passed from jwtAuth" });
    }

    // It found the token
    console.log("err0")
    const token = authorization.split(' ')[1];
    console.log(token)
    console.log("err1")
    if (!token) {
        return res.status(401).json({ err: "User not authorized" });
    }
    console.log("err2")
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(decoded)
        console.log(req)
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Invalid Token Passed hello");
    }
}
    
const generateToken = (userData) => {
    return jwt.sign({userData}, process.env.JWT_SECRET, { expiresIn: 30000 });
}

module.exports = { jwtAuthMiddleware, generateToken };