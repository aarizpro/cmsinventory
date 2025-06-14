const mongoose = require("mongoose");

const employeeMasterSchema = mongoose.Schema(
    {
        empId:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        empName:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        empMobile:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        empLocation:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        empDept:{
            type:String,
            required:[true,"Enter the Right Data"]
        },
        
    },{
        timestamps:true
    }
    
    
);

const EmployeeMaster = mongoose.model("EmployeeMaster",employeeMasterSchema);

module.exports = EmployeeMaster;