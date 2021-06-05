let pool = require('./connection')

const addPlayer = async (player) => {

    const { team_id, firstname, lastname, country, age, role, marketvalue } = player;
    const result = await pool.query(
        'INSERT INTO Player (team_id, firstname, lastname, country, age, role, marketvalue) VALUES ( $1 , $2 , $3 , $4, $5, $6 , $7) returning *' ,
        [ team_id, firstname, lastname, country, age, role, marketvalue ]
    );
    return result.rows.length ? result.rows[0] : null;
}

const getPlayerByID = async (id) => {
    const result = await pool.query(
        'SELECT * FROM Player where id = $1 ' ,
        [ id ]
    );
    return result.rows.length ? result.rows[0] : null;
}

const getAllPlayers = async () => {
    const result = await pool.query(
        'SELECT * FROM Player' ,
        [ ]
    );
    return result.rows.length ? result.rows : null;
}

const getPlayersByTeamID = async (team_id) => {
    const result = await pool.query(
        'SELECT * FROM Player where team_id = $1 ' ,
        [ team_id ]
    );
    return result.rows.length ? result.rows : null;
}

const updatePlayer = async ( player ) => {

    const { id , team_id, firstname, lastname, country, age, role, marketvalue } = player;

    const result = await pool.query(
        'UPDATE Player set team_id=$1,firstname=$2,lastname=$3,country=$4,age=$5,role=$6,marketvalue=$7 where id = $8 returning *' ,
        [ team_id, firstname, lastname, country, age, role, marketvalue , id]
    );
    return result.rows.length ? result.rows[0] : null;
}


module.exports = {
    addPlayer,
    getPlayerByID,
    getAllPlayers,
    getPlayersByTeamID,
    updatePlayer
}