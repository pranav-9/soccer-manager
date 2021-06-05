const router = require('express').Router()
const verify = require('../common/verifyToken')
const { getTeamByUserID , updateTeam } = require('../db/TeamQueries')
const { getPlayersByTeamID } = require('../db/PlayerQueries')
const { updateTeamValidation } = require('../common/validation')

router.get('/', verify ,async (req,res) => {

    try {
        let team = await getTeamByUserID(req.user.id);
        let players = await getPlayersByTeamID(team.id);
        if( players == null ) throw "Team Players not found";
        team['players'] = players;
        res.send(team)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.patch('/', verify , async (req,res) => {

    // Validation
    const { value , error } = updateTeamValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);  

    try {
        let team = await getTeamByUserID(req.user.id);
        if(req.body.name) team['name'] = req.body.name;
        if(req.body.country) team['country'] = req.body.country;
        let updatedTeam = await updateTeam(team);
        res.send(updatedTeam)
    } catch (error) {
        res.status(400).send(error)
    }

    
})

module.exports = router;