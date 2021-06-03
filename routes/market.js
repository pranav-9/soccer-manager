const router = require('express').Router()
const verify = require('../common/verifyToken')
const { getPlayerByID } = require('../db/PlayerQueries')
const { getOrdersByStatus } = require('../db/OrderQueries')

router.get('/', verify ,async (req,res) => {

    try {

        let created_orders = await getOrdersByStatus("CREATED");        
        console.log(created_orders);
        let market = []
        for (let index = 0; index < created_orders.length; index++) {
            const element = created_orders[index];
            let playerInfo = await getPlayerByID(element.player_id)
            element["player_info"] = playerInfo            
            // const playerInMarket = {
            //     firstname: playerInfo.firstname,
            //     lastname: playerInfo.lastname,
            //     age: 39,
            //     role: "gk",
            // }
        }
        res.send(created_orders)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.patch('/', verify , async (req,res) => {
    
})

module.exports = router;