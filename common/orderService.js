const { createOrder, getOrderByID, getOrdersByPlayerIDandStatus } = require('../db/OrderQueries')

const processSellOrder = async (req) => {

    let player_id = req.body.player_id;

    const orderAlreadyExists = await getOrdersByPlayerIDandStatus(player_id,'CREATED');

    if (orderAlreadyExists != null) throw "Player already in market"

    let order = {
        user_id: req.user.id,
        type: req.body.type,
        price: req.body.price,
        player_id: player_id,
        status: 'CREATED'     
    };
    return await createOrder(order);
}

const getSellOrder = async ( order_id) => {

    let sellOrder = await getOrderByID(order_id);
    
    if (sellOrder == null) throw "Bad Request"
    if (sellOrder.status == 'FULFILLED') throw "Player Already Bought"
    if (sellOrder.type == 'BUY') throw "Bad Request"

    return sellOrder;

}

module.exports = {
    processSellOrder,
    getSellOrder
}