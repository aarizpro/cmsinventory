const mongoose = require("mongoose");

const binMasterSchema = mongoose.Schema(
    {
        binId:{
            type:Number,
            required:[true,"Enter the Right Data"]
        },
        binName:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
    },{
        timestamps:true
    }
    
    
);

const BinMasterDetails = mongoose.model("BinMasterDetails",binMasterSchema);

module.exports = BinMasterDetails;