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

const orderValidation = async (order) => {
    const schema = Joi.object({

        type: Joi.string()
            .regex(/^(BUY|SELL)$/)
            .required(),
        
        player_id : Joi.number().integer(),

        price : Joi.number(),

        order_id : Joi.number().integer()

    })
    .xor("price","order_id")
    .xor("player_id","order_id")
    .and("player_id","price")
    ;

    return schema.validate(order);
}

const updateTeamValidation = async (order) => {
    const schema = Joi.object({

        name: Joi.string(),
        
        country : Joi.string()

    })
    .or("name","country")
    ;

    return schema.validate(order);
}


module.exports = { 
    registerValidation , 
    loginValidation,
    orderValidation,
    updateTeamValidation
}
