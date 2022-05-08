const User = require("../models/user");
const router = require("express").Router();
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");


const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
});



router.post("/register", async (request, response) =>{

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(request.body.password, salt);


    // Dentro del método que invoca POST 
    // Usaremos la propiedad error del objeto que nos entrega schemaRegister.validate()
    const { error } = schemaRegister.validate(request.body);
    // Si este error existe, aqui se termina la ejecución devolviedonos el error
    if(error){
        return response.status(400).json(
            {error: error.details[0].message}
        );
    }

    const isEmailExist = await User.findOne({email: request.body.email});

    if(isEmailExist){
        return response.status(400).json(
            {error: "Email ya registrado"}
        );
    }

    const user = new User({
        name: request.body.name,
        email: request.body.email,
        password: password
    });
    try{
        const savedUser = await user.save();
        response.json({
            error: null,
            data: savedUser
        });
    }catch(error){
        response.status(400).json({error});
    }
    response.json({
        error: null, 
        data: "Se recibieron las credenciales"
    });
});

module.exports = router;