const jwt = require('jsonwebtoken')

module.exports = function (req,res,next) {
    const token = req.header('auth-token');

    if(!token) return res.status(401).send("Access Denied");

    try {
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        if(verified == null || verified.user_id == null ) throw 'Could not identify User'
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).send('Invalid token')
    }
}