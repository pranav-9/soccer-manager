const Joi = require('joi');

// Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),
    
        password: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    
        // repeat_password: Joi.ref('password'),
       
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

        password: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
       
        
    });
    return schema.validate(data);
}


module.exports = { registerValidation , loginValidation }
