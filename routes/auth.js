const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../common/validation')



router.post('/register', async (req,res) => {

    // Validation
    const { value , error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);  

    // Check if e-mail exists
    const emailExists = await User.findOne( { email : req.body.email });
    if(emailExists) return res.status(400).send('Email already exists');

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    // Create new User
    const user = new User({
        name : req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    console.log(user);

    try {
        const savedUser = await user.save();
        return res.send({user: user._id})
    } catch (error) {
        console.log(error);
        return res.status(400).send(error)        
    }
    
})

router.post('/login' , async (req,res) => {

    const { value, error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    // Check if e-mail exists
    const user = await User.findOne( { email : req.body.email });
    if(!user) return res.status(400).send('Email does not exist');

    const validPassword = await bcrypt.compare(req.body.password,user.password);

    if(!validPassword) return res.status(400).send('Password is wrong');

    // Create and assign token
    const token = jwt.sign({ _id : user._id },process.env.TOKEN_SECRET);

    res.header('auth-token',token).send(token);



})

module.exports = router;
