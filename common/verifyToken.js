const jwt = require('jsonwebtoken')
const { getUserByID } = require('../db/AppUsersQueries')
const { hasPermissionToAccess } = require('../db/PermissionQueries')

module.exports = async (req,res,next) => {
    const token = req.header('auth-token');

    if(!token) return res.status(401).send("Access Denied");

    try {
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        if(verified == null || verified.user_id == null ) throw 'Could not identify User'

        const user = await getUserByID(verified.user_id);
        let entityRequested = req.baseUrl.split("/api/")[1];        
        console.log(entityRequested,user.role,req.method);
        const is_allowed = await hasPermissionToAccess(user.role,entityRequested, req.method);
        if (is_allowed==null || !is_allowed.is_allowed) throw("Do not have permission to access")

        req.user = verified;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).send(error)
    }
}