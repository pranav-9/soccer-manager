const router = require('express').Router();
const verify = require('../common/verifyToken')
const { createOrder, getOrderByID, updateOrderStatus } = require('../db/OrderQueries')
const { updatePlayer , getPlayerByID } = require('../db/PlayerQueries')
const { getTeamByUserID, updateTeam } = require('../db/TeamQueries')
const { getPlayerNewMarketValue } = require('../common/playerService');
const { orderValidation } = require('../common/validation')
const { processSellOrder, getSellOrder } = require('../common/orderService')


// separate out to functions-modular 
router.post('/' , verify , async(req,res) => {

    // Validation
    const { value , error } = orderValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);  

    try {

        if (req.body.type === 'SELL') {
            let savedOrder = await processSellOrder(req)
            return res.send(savedOrder);            
        }
        
        // get matching sell order
        let sellOrder = await getSellOrder(req.body.order_id);
        let player = await getPlayerByID(sellOrder.player_id)

        console.log(sellOrder);

        // check if buyer has enough money
        let buyerTeam = await getTeamByUserID(req.user.id);
        if (buyerTeam == null ) throw "Bad Request"
        let askingPrice = parseFloat(sellOrder.price);
        if (askingPrice > parseFloat(buyerTeam.budget_left)) return res.send("Not enough budget to buy player")

        //check if player is not already in buyer team
        if ( player.team_id === buyerTeam.id) throw "You cannot buy your own player"

        //create buy order
        let order = {
            user_id: req.user.id,
            type: req.body.type,
            price: askingPrice,
            player_id: sellOrder.player_id,
            status: 'FULFILLED'
        };
        let savedOrder = await createOrder(order);
        // update sell order
        sellOrder['status'] = 'FULFILLED';
        let updatedSellOrder = await updateOrderStatus(sellOrder);
        
        // update player
        let oldValue = parseFloat(player.marketvalue);
        let newValue = await getPlayerNewMarketValue(player);
        player['team_id'] = buyerTeam.id;
        player['marketvalue'] = newValue;
        console.log(player);
        // update player team and value
        let updatedplayer = await updatePlayer(player);

        // update buyer team 
        buyerTeam.budget_left = parseFloat(buyerTeam.budget_left) - askingPrice;
        buyerTeam.value = parseFloat(buyerTeam.value) + newValue;
        console.log(buyerTeam);
        await updateTeam(buyerTeam);
        
        //update seller team
        let sellerTeam = await getTeamByUserID(sellOrder.user_id);
        sellerTeam.budget_left = parseFloat(sellerTeam.budget_left )+ askingPrice;
        sellerTeam.value = parseFloat(sellerTeam.value) - oldValue;
        console.log(sellerTeam);        
        await updateTeam(sellerTeam);

        return res.send(savedOrder);
              
    } catch (error) {
        res.status(400).send(error);
    }

    
})

module.exports = router