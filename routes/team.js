const router = require('express').Router()
const verify = require('../common/verifyToken')
const { getTeamByUserID } = require('../db/TeamQueries')
const { getPlayersByTeamID } = require('../db/PlayerQueries')

router.get('/', verify ,async (req,res) => {
    console.log(req.user);


    try {
        let team = await getTeamByUserID(req.user.user_id);
        let players = await getPlayersByTeamID(team.id);
        if( players == null ) throw "Team Players not found";
        team['players'] = players;
        res.send(team)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.patch('/', verify , async (req,res) => {
    
})

module.exports = router;