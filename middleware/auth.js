const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //read token from header
    const token = req.header('x-auth-token')

    //check if no token
    if(!token) {
        res.status(401).json({ msg: "Invalid permission " })
    }

    //validate token
    try {
        const encrypted = jwt.verify(token, process.env.SECRET);
        req.user = encrypted.user;
        next();

    } catch(error) {
        res.status(401).json({ msg: "Token not valid" });
    }
}