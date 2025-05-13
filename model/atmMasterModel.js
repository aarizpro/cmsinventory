const mongoose = require("mongoose");

const atmMasterSchema = mongoose.Schema(
    {
        atmId:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        mspAccount:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        bankCode:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        location:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        hubLocation:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        atmCategory:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        atmType:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        address:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        pincode:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        model:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        siteCode:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        cashLoadingType:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        atmStatus:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        routeCode:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        lockType:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        longitude:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        latitude:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        routeName:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
    },{
        timestamps:true
    }
    
    
);

const AtmMasterDetails = mongoose.model("AtmMasterDetails",atmMasterSchema);

module.exports = AtmMasterDetails;