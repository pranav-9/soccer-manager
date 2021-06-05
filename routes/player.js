const router = require('express').Router()
const verify = require('../common/verifyToken')

const { updatePlayerValidation } = require('../common/validation')
const { getPlayerByID , updatePlayer } = require('../db/PlayerQueries')

router.patch('/', verify , async (req,res) => {

    // Validation
    const { value , error } = updatePlayerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);  

    try {
        // console.log(req);
        let player = await getPlayerByID(req.query.id);
        console.log(player);
        if(req.body.firstname) player['firstname'] = req.body.firstname;
        if(req.body.lastname) player['lastname'] = req.body.lastname;
        if(req.body.country) player['country'] = req.body.country;
        console.log(player);
        let updatedPlayer = await updatePlayer(player);
        res.send(updatedPlayer)
    } catch (error) {
        res.status(400).send(error)
    }

    
})

module.exports = router;