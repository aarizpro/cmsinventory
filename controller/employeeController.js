const EmployeeMaster = require("../model/employeeModel");
const asyncHandler = require("express-async-handler");

const getCourierDetails = asyncHandler(async(req,res)=>{
    try {
        const courierDetails = await EmployeeMaster.find({});
        res.status(200).json(courierDetails);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const getCourierDetail = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const courierdetails = await EmployeeMaster.findById(id);
        res.status(200).json(courierdetails);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const createCourier = asyncHandler(async(req,res)=>{
    try {
        const courierDetails = await EmployeeMaster.create(req.body);
        res.status(200).json(courierDetails);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const updateCourier = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        const courierDetails = await EmployeeMaster.findByIdAndUpdate(id, req.body);
        if(!courierDetails){
            res.status(404);
            throw new Error(`Cannot Find the Courier ${id}`);
        }
        const updatedCourier = await EmployeeMaster.findById(id);
        res.status(200).json(updatedCourier);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const deleteCourier = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        const courierDetails = await EmployeeMaster.findByIdAndDelete(id);
        if(!courierDetails){
            res.status(404);
            throw new Error(`Cannot find the ID ${id}`);
        }
        res.status(200).json(courierDetails);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const getEmployeeDetailsById = asyncHandler(async (req, res) => {
    const empId = req.params.empId || req.query.empId;
    if (!empId || empId.trim() === "") {
        return res.status(400).json({ error: "Employee ID is required." });
    }

    const employee = await EmployeeMaster.findOne({ empId: empId.trim() })
        .select("empId empName empMobile empDept empLocation");

    if (!employee) {
        return res.status(404).json({ error: "Employee not found." });
    }

    res.status(200).json(employee);
});

module.exports = {
    getCourierDetails,
    createCourier,
    updateCourier,
    deleteCourier,
    getCourierDetail,
    getEmployeeDetailsById
};
