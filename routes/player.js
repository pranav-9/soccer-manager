const router = require('express').Router()
const verify = require('../common/verifyToken')
const { updatePlayerValidation , newPlayerValidation } = require('../common/validation')
const { addPlayer , getPlayerByID , getAllPlayers , updatePlayer, deletePlayerByID} = require('../db/PlayerQueries')
const { getTeamByUserID } = require('../db/TeamQueries')
const { createOrder } = require('../db/OrderQueries')
const { deletePlayer } = require('../common/playerService')

// only accessible by admin
router.get('/',verify , async (req,res) => {
    try {
        
        if (req.query.id != null) {
            const player = await getPlayerByID(req.query.id);
            return res.send(player);                
        }    

        const players = await getAllPlayers();
        return res.send(players);

    } catch (error) {
        res.status(400).send(error);        
    }
})

router.post('/' , verify , async (req,res) => {

    // Validation
    const { value , error } = newPlayerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message); 
    
    // console.log(req.body);

    try {
        let newPlayer = await addPlayer(req.body);
        if (newPlayer.team_id == null) {
            let order = {
                type: 'SELL',
                price: newPlayer.marketvalue,
                player_id: newPlayer.id,
                status: 'CREATED'     
            };
            await createOrder(order);
        }
        res.send(newPlayer);
    } catch (error) {
        res.status(400).send(error)
    }

})

router.patch('/', verify , async (req,res) => {

    // Validation
    const { value , error } = updatePlayerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);  

    try {
        const user = req.user;
        let player = await getPlayerByID(req.query.id);
        const userTeam = await getTeamByUserID(user.id);
        if(userTeam.id !== player.team_id && user.role === 'USER') throw "You cannot modify other team's player"
        
        if(req.body.firstname) player['firstname'] = req.body.firstname;
        if(req.body.lastname) player['lastname'] = req.body.lastname;
        if(req.body.country) player['country'] = req.body.country;
        if(req.body.age != null ) {
            if(user.role !== 'ADMIN') throw "You cannot change age of player"
            player['age'] = req.body.age;
        }
        if(req.body.role) {
            if(user.role !== 'ADMIN') throw "You cannot change role of player"
            player['role'] = req.body.role;
        }
        if(req.body.marketvalue) {
            if(user.role !== 'ADMIN') throw "You cannot change market value of player"
            player['marketvalue'] = req.body.marketvalue;
        }

        let updatedPlayer = await updatePlayer(player);
        res.send(updatedPlayer)

    } catch (error) {
        res.status(400).send(error)
    }

    
})

router.delete('/' , verify , async (req,res) => { 

    try {
        const deletedPlayer = await deletePlayer(req.query.id);        
        return res.send(deletedPlayer)      
    } catch (error) {
        res.status(400).send(error);        
    }

})


module.exports = router;