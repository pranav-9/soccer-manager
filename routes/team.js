const router = require('express').Router()
const verify = require('../common/verifyToken')
const { addTeam ,getTeamByUserID , getAllTeams ,updateTeam, getTeamByID } = require('../db/TeamQueries')
const { getPlayersByTeamID } = require('../db/PlayerQueries')
const { updateTeamValidation, addTeamValidation } = require('../common/validation')
const { deleteTeam } = require('../common/teamService')

router.get('/', verify ,async (req,res) => {

    try {

        if (req.user.role === 'ADMIN') {
            if (req.query.id == null) {
                const teams = await getAllTeams();
                return res.send(teams);                
            } else {
                const team = await getTeamByID(req.query.id);
                return res.send(team);  
            }
        }

        let team = await getTeamByUserID(req.user.id);
        let players = await getPlayersByTeamID(team.id);
        if( players == null ) throw "Team Players not found";
        team['players'] = players;
        res.send(team)

    } catch (error) {
        res.status(400).send(error)
    }

})

// only for admin
router.post('/',verify, async(req,res) => {

    // Validation
    const { value , error } = addTeamValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);  

    try {
        if (req.body.value == null) req.body.value = 0;
        if (req.body.budget_left == null) req.body.budget_left = 0;
        let newTeam = await addTeam(req.body);
        res.send(newTeam)
    } catch (error) {
        res.status(400).send(error)
    } 
})

router.patch('/', verify , async (req,res) => {

    // Validation
    const { value , error } = updateTeamValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);  

    try {

        let team = null;
        if (req.user.role === 'ADMIN') {
            if (req.query.id == null) {
                throw "Please provide team id"               
            } else {
                team = await getTeamByID(req.query.id);
            }
        } else {
            team = await getTeamByUserID(req.user.id);
        }
        
        if(req.body.name) team['name'] = req.body.name;
        if(req.body.country) team['country'] = req.body.country;
        if(req.body.user_id) {
            if(req.user.role !== 'ADMIN') throw "You cannot change user_id of team"
            team['user_id'] = req.body.user_id;
        }
        if(req.body.budget_left != null) {
            if(req.user.role !== 'ADMIN') throw "You cannot change budget_left of team"
            team['budget_left'] = req.body.budget_left;
        }

        let updatedTeam = await updateTeam(team);
        res.send(updatedTeam)
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }

    
})

router.delete('/' , verify , async (req,res) => { 

    try {
        
        if (req.query.id == null) throw "Please specify team to delete";

        const deletedTeam = await deleteTeam(req.query.id);
        
        return res.send(deletedTeam);       
       

    } catch (error) {
        res.status(400).send(error);        
    }

})

module.exports = router;