let pool = require('./connection')

const addUser = async (user) => {
    const { name, email , password , role } = user;
    const result = await pool.query(
        'INSERT INTO AppUsers (name,email,password,role) VALUES ( $1 , $2 , $3 , $4 ) returning *' ,
        [ name, email, password, role]
    );
    return result.rows.length ? result.rows[0] : null;
}

const getAllUsers = async () => {
    const result = await pool.query(
        'SELECT * FROM AppUsers' ,
        [  ]
    );
    return result.rows.length ? result.rows : null;
}

const getUserByID = async (id) => {
    const result = await pool.query(
        'SELECT * FROM AppUsers where id = $1 ' ,
        [ id ]
    );
    return result.rows.length ? result.rows[0] : null;
}

const getUserByEmailID = async (email) => {
    const result = await pool.query(
        'SELECT * FROM AppUsers where email = $1 ' ,
        [ email ]
    );
    return result.rows.length ? result.rows[0] : null;
}

const deleteUserByID = async (id) => {
    const result = await pool.query(
        'DELETE FROM AppUsers where id = $1 returning *' ,
        [ id ]
    );
    return result.rows.length ? result.rows[0] : null;
}

// for testing purpose
const deleteAllUsers = async () => {
    const result = await pool.query(
        'DELETE FROM AppUsers returning *' ,
        [ ]
    );
    return result.rows.length ? result.rows : null;
}

module.exports = {
    addUser,
    getAllUsers,
    getUserByID,
    getUserByEmailID,
    deleteUserByID,
    deleteAllUsers
}