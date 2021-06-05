let pool = require('./connection')



const hasPermissionToAccess = async (role,entity,request) => {
    const result = await pool.query(
        'SELECT * FROM permissions where role = $1 and entity = $2 and request = $3 ' ,
        [ role , entity , request ]
    );
    return result.rows.length ? result.rows[0] : null;
}

module.exports = {
    hasPermissionToAccess
}