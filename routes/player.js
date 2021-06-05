const router = require('express').Router()
const verify = require('../common/verifyToken')
const { updatePlayerValidation } = require('../common/validation')
const { getPlayerByID , getAllPlayers , updatePlayer } = require('../db/PlayerQueries')
const { getTeamByUserID } = require('../db/TeamQueries')

router.get('/',verify , async (req,res) => {
    try {
        const players = await getAllPlayers();
        res.send(players);
    } catch (error) {
        res.status(400).send(error);        
    }
})

router.patch('/', verify , async (req,res) => {

    // Validation
    const { value , error } = updatePlayerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);  

    console.log('Validation passed');

    try {
        // console.log(req);
        const user = req.user;
        let player = await getPlayerByID(req.query.id);
        const userTeam = await getTeamByUserID(user.id);
        if(userTeam.id !== player.team_id && user.role === 'USER') throw "You cannot modify other team's player"
        
        if(req.body.firstname) player['firstname'] = req.body.firstname;
        if(req.body.lastname) player['lastname'] = req.body.lastname;
        if(req.body.country) player['country'] = req.body.country;
        if(req.body.age) {
            if(user.role !== 'ADMIN') throw "You cannot change age of player"
            player['age'] = req.body.age;
        }
        if(req.body.role) {
            if(user.role !== 'ADMIN') throw "You cannot change age of player"
            player['role'] = req.body.role;
        }
        if(req.body.marketvalue) {
            if(user.role !== 'ADMIN') throw "You cannot change age of player"
            player['marketvalue'] = req.body.marketvalue;
        }
        console.log(player);
        let updatedPlayer = await updatePlayer(player);
        res.send(updatedPlayer)
    } catch (error) {
        res.status(400).send(error)
    }

    
})

module.exports = router;