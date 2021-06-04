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
            const playerInMarket = {
                order_id: element['id'],
                firstname: playerInfo.firstname,
                lastname: playerInfo.lastname,
                age: playerInfo.age,
                role: playerInfo.role,
                type: element['type'],
                asking_price: element['price']
            }
            market.push(playerInMarket);
        }

        const filters = req.query;
        const filteredMarket = market.filter(user => {
            let isValid = true;
            for (key in filters) {
            console.log(key, user[key], filters[key]);
            isValid = isValid && user[key] == filters[key];
            }
            return isValid;
        });

        // console.log(filteredMarket);


        res.send(filteredMarket)


    } catch (error) {
        res.status(400).send(error)
    }

})

router.patch('/', verify , async (req,res) => {
    
})

module.exports = router;