let pool = require('./connection')

const addTeam = async (team) => {
    const { user_id, name, country, value, budget_left } = team;
    const result = await pool.query(
        'INSERT INTO Team (user_id, name, country, value, budget_left) VALUES ( $1 , $2 , $3 , $4, $5) returning *' ,
        [ user_id, name, country, value, budget_left]
    );
    return result.rows.length ? result.rows[0] : null;
}

const getTeamByUserID = async (user_id) => {
    const result = await pool.query(
        'SELECT * FROM Team where user_id = $1 ' ,
        [ user_id ]
    );
    return result.rows.length ? result.rows[0] : null;
}

module.exports = {
    addTeam,
    getTeamByUserID
}