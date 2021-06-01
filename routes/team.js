const router = require('express').Router()
const verify = require('../common/verifyToken')

router.get('/', verify ,(req,res) => {
    console.log(req.user);
    res.send("team")

})

module.exports = router;