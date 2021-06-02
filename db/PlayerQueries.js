let pool = require('./connection')

const addPlayer = async (player) => {

    const { team_id, firstname, lastname, age, role, marketvalue } = player;
    const result = await pool.query(
        'INSERT INTO Player (team_id, firstname, lastname, age, role, marketvalue) VALUES ( $1 , $2 , $3 , $4, $5, $6) returning *' ,
        [ team_id, firstname, lastname, age, role, marketvalue ]
    );
    return result.rows.length ? result.rows[0] : null;
}


module.exports = {
    addPlayer
}