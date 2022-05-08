const router= require("express").Router();

router.get("/", (request, response)=>{
    response.json({
        error: null,
        data:{
            title: "Esta es una ruta protegida",
            user: request.user
        }
    });
}); 

module.exports = router;