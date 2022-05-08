const User = require("../models/user");
const router = require("express").Router();
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
});


router.post("/login", async (request, response) =>{
    const { error } = schemaLogin.validate(request.body);
    if(error){
        return response.status(400).json({error: error.details[0].message});
    }

    const user = await User.findOne({email: request.body.email});

    if(!user){
        return response.status(400).json({error: "Usuario no existe"});
    }
   
    const validPassrowd = await bcrypt.compare(request.body.password, user.password);
    if(!validPassrowd){
        return response.status(400).json({error: "Contraseña Incorrecta"});
    }


    //Crecion de token con jwt
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.TOKEN_SECRET);

    response.header("auth-token", token).json({
        error: null,
        data: { token},
        message: "Bienvenido "+user.name
    });
    
});

module.exports = router;