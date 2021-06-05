let pool = require('./connection')

const createOrder = async (order) => {
    
    const { user_id, player_id, type, price, status } = order;
    const result = await pool.query(
        'INSERT INTO "Order" (user_id, player_id, type, price, status) VALUES ( $1 , $2 , $3 , $4, $5) returning *' ,
        [ user_id, player_id, type, price, status]
    );
    return result.rows.length ? result.rows[0] : null;
}

const getOrderByID = async ( id ) => {
    const result = await pool.query(
        'SELECT * FROM "Order" where id = $1 ' ,
        [ id ]
    );
    return result.rows.length ? result.rows[0] : null;
}

const getOrdersByStatus = async ( status) => {
    const result = await pool.query(
        'SELECT * FROM "Order" where status = $1 ' ,
        [ status ]
    );
    return result.rows.length ? result.rows : null;
}

const getOrdersByPlayerIDandStatus = async ( player_id, status) => {
    const result = await pool.query(
        'SELECT * FROM "Order" where status = $1 and player_id = $2' ,
        [ status , player_id]
    );
    return result.rows.length ? result.rows : null;
}

const updateOrderStatus = async ( order ) => {

    const { id , status } = order;
    const result = await pool.query(
        'UPDATE "Order" set status = $1 where id = $2 returning *' ,
        [ status , id ]
    );
    return result.rows.length ? result.rows : null;
}

module.exports = {
    createOrder,
    getOrderByID,
    getOrdersByStatus,
    updateOrderStatus,
    getOrdersByPlayerIDandStatus
}