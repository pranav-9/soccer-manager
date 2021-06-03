const router = require('express').Router();
const verify = require('../common/verifyToken')
const { createOrder, getOrderByID, updateOrderStatus } = require('../db/OrderQueries')
const { updatePlayer , getPlayerByID } = require('../db/PlayerQueries')
const { getTeamByUserID, updateTeam } = require('../db/TeamQueries')
const { getPlayerNewMarketValue } = require('../common/playerService')


// separate out to functions-modular 
router.post('/' , verify , async(req,res) => {

    try {
        let order = {
            user_id: req.user.user_id,
            type: req.body.type            
        }

        if ( order.type == 'SELL' ) {
            order["price"] = req.body.price;
            order['player_id'] = req.body.player_id;
            order['status'] = 'CREATED';
            let savedOrder = await createOrder(order);
            return res.send(savedOrder)  
        }

        // if buy order
        let sellOrder = await getOrderByID(req.body.order_id);

        if (sellOrder == null) throw "Bad Request"
        if (sellOrder.status == 'FULFILLED') return res.send("Player Already Bought")
        if (sellOrder.type == 'BUY') throw "Bad Request"

        console.log(sellOrder);

        // check if buyer has enough money
        let buyerTeam = await getTeamByUserID(req.user.user_id);
        if (buyerTeam == null ) throw "Bad Request"
        let askingPrice = parseFloat(sellOrder.price);
        if (askingPrice > parseFloat(buyerTeam.budget_left)) return res.send("Not enough budget to buy player")

        order["price"] = askingPrice;
        order['player_id'] = sellOrder.player_id;
        order['status'] = 'FULFILLED';

        let savedOrder = await createOrder(order);
        // update buy order
        let updatedBuyOrder = await updateOrderStatus(sellOrder.id,'FULFILLED');
        
        
        let player = await getPlayerByID(sellOrder.player_id)
        console.log(player);
        let oldValue = parseFloat(player.marketvalue);
        let newValue = await getPlayerNewMarketValue(player);
        console.log(newValue);

        player['marketvalue'] = newValue;
        console.log(player);
        // update player team and value
        let updatedplayer = await updatePlayer(player);

        // update team value
        console.log(buyerTeam);
        buyerTeam.budget_left = parseFloat(buyerTeam.budget_left) - askingPrice;
        buyerTeam.value = parseFloat(buyerTeam.value) + newValue;
        console.log(buyerTeam);
        await updateTeam(buyerTeam)
        
        let sellerTeam = await getTeamByUserID(sellOrder.user_id);
        console.log(sellerTeam);
        sellerTeam.budget_left = parseFloat(sellerTeam.budget_left )+ askingPrice;
        sellerTeam.marketvalue = parseFloat(sellerTeam.marketvalue) - oldValue;
        
        await updateTeam(sellerTeam);



        return res.send(savedOrder);



              
    } catch (error) {
        res.status(400).send(error);
    }

    
})

module.exports = router