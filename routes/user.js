const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../common/validation')
const { addUser, getUserByEmailID, getAllUsers, getUserByID, deleteUserByID } = require('../db/AppUsersQueries')
const { initializeTeam , deleteTeam } = require('../common/teamService')
const verify = require('../common/verifyToken');
const { getTeamByUserID } = require('../db/TeamQueries');


router.get('/', verify ,async (req,res) => {

    try {

        if (req.query.id == null) {
            const users = await getAllUsers();
            return res.send(users);                
        } else {
            const user = await getUserByID(req.query.id);
            return res.send(user);  
        }

    } catch (error) {
        res.status(400).send(error)
    }

})

router.post('/register', async (req,res) => {

    // Validation
    const { value , error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);  

    // Check if e-mail exists
    try {
        const emailExists = await getUserByEmailID( req.body.email );
        if(emailExists) return res.status(400).send('Email already exists');
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }    

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    // Create new User
    const newUser = {
        name : req.body.name,
        email: req.body.email,
        password: hashPassword,
        role:'USER'
    };

    try {
        const savedUser = await addUser(newUser);
        res.send({user: savedUser});
        await initializeTeam(savedUser);
        return;
    } catch (error) {
        console.log(error);
        return res.status(400).send(error)        
    }
    
})

router.post('/login' , async (req,res) => {

    const { value, error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    // Check if e-mail exists
    const user = await getUserByEmailID( req.body.email );
    if(!user) return res.status(400).send('Email does not exist');

    const validPassword = await bcrypt.compare(req.body.password,user.password);

    if(!validPassword) return res.status(400).send('Password is wrong');

    // Create and assign token
    const token = jwt.sign({ user_id : user.id },process.env.TOKEN_SECRET);

    res.header('auth-token',token).send(token);



})

router.delete('/' ,verify , async (req,res) => {

    try {
        
        if (req.query.id == null) throw "Please specify user to delete";

        //delete team
        const team = await getTeamByUserID(req.query.id);
        console.log(team);
        if (team != null) {
            const deletedTeam = await deleteTeam(team.id);    
            console.log(deletedTeam);
        }        

        const deletedUser = await deleteUserByID(req.query.id);
        
        return res.send(deletedUser);              

    } catch (error) {
        res.status(400).send(error);        
    }

})

module.exports = router;
