const { createOrder, getOrderByID, updateOrderStatus } = require('../db/OrderQueries')

const processSellOrder = async (req) => {

    let order = {
        user_id: req.user.user_id,
        type: req.body.type,
        price: req.body.price,
        player_id: req.body.player_id,
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