const jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtAuthMiddleware = (req, res, next) => {
    const authorization = `Bearer ${req.cookies.token}`;
    console.log(authorization)

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Invalid token passed from jwtAuth" });
    }

    console.log("err0")
    const token = authorization.split(' ')[1];
    console.log(token)
    console.log("err1")
    if (!token) {
        return res.status(401).json({ err: "User not authorized" });
    }
    console.log("err2")
    try {
        console.log("err3")
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("err4")
        req.user = decoded;
        console.log("err5")
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Invalid Token Passed hello");
    }
}

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 30000 });
}

module.exports = { jwtAuthMiddleware, generateToken };