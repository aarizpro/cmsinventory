const mongoose = require("mongoose");

const MONGO_DB = process.env.MONGO_URL

const connectDB = async()=>{
    try {
        await mongoose.connect(MONGO_DB).then(()=>{
            console.log("Database Connected");
        })
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;