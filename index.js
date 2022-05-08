require("dotenv").config();
const express = require("express");
const authRoutes = require("./routers/auth");
const loginRoute = require("./routers/login");
const dashboardRouter = require("./routers/dashboard");
const verifyToken = require("./routers/validate-token");
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 3000;
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@fumigacionexpress.ayon2.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log(`Conectado a la base de datos ${process.env.DBNAME}`);
    })
    .catch((e) =>{
        console.log("Database error", e);
    });

var corsOptions = {
    origin: `localhost:${port}`, //Remplazar por el dominio de nuestro front
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.get("/", (request, response) =>{
    response.json({ mensaje: "La API funciona!!" });
});

app.use("/api/user", authRoutes);
app.use("/api/user", loginRoute);
app.use("/api/dashboard", verifyToken, dashboardRouter);


app.listen(port, () =>{
    console.log(`El servidor esta corriendo en el puerto: ${port}`);
});