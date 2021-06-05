const { updatePlayerValidation } = require('../common/validation')
const { getPlayerByID } = require('../db/PlayerQueries')

couter.patch('/', verify , async (req,res) => {

    // Validation
    const { value , error } = updatePlayerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);  

    try {
        let player = await getTeamByUserID(req.params.id);
        if(req.body.firstname) player['firstname'] = req.body.firstname;
        if(req.body.lastname) player['lastname'] = req.body.lastname;
        let updatedTeam = await updateTeam(team);
        res.send(updatedTeam)
    } catch (error) {
        res.status(400).send(error)
    }

    
})