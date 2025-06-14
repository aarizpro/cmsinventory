const mongoose = require("mongoose");



const mainVaultLedgerSchema = mongoose.Schema(
    {
        binId:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        cmoNumber:{
            type:Number,
            required:[true,"Enter the Right Data"]
        },
        cashType:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        particulars:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        amountType:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        deno500:{
            type:Number,
            required:[true,"Enter the Right Data"]
        },
        deno200:{
            type:Number,
            required:[true,"Enter the Right Data"]
        },
        deno100:{
            type:Number,
            required:[true,"Enter the Right Data"]
        },
        denoOnes:{
            type:Number,
            required:[true,"Enter the Right Data"]
        },
        empId:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        empName:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        empMobile:{
            type:Number,
            required:[true,"Enter the Right Data"]
        },
        vaultOfficerId:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        vaultOfficerName:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        vaultOfficerMobile:{
            type:Number,
            required:[true,"Enter the Right Data"]
        },
        remarks:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        dateOfCmo:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
    },{
        timestamps:true
    }
    
    
);


const MainVaultLedger = mongoose.model("MainVaultLedger",mainVaultLedgerSchema);

module.exports = MainVaultLedger;