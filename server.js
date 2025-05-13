require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes")
const atmMasterRoutes = require("./routes/atmMasterRoutes")


const app = express();

const PORT = process.env.PORT||3000 ;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/api/users",userRoutes);
app.use("/api/atm",atmMasterRoutes);


connectDB();

app.listen(PORT,()=>{
    console.log(`Server Connected via ${PORT}`);
})

