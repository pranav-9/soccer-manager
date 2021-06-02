let pool = require('./connection')

const addUser = async (user) => {
    const { name, email , password } = user;
    const result = await pool.query(
        'INSERT INTO users (name,email,password) VALUES ( $1 , $2 , $3 ) returning *' ,
        [ name, email, password]
    );
    return result.rows;
}

const getUserByEmailID = async (email) => {
    const result = await pool.query(
        'SELECT * FROM users where email = $1 ' ,
        [ email ]
    );
    return result.rows.length ? result.rows[0] : null;
}

module.exports = {
    addUser,
    getUserByEmailID
}