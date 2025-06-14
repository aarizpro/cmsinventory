const CourierDetails = require("../model/binMasterModel")
const asyncHandler = require("express-async-handler");


const getCourierDetails = asyncHandler(async(req,res)=>{
    try {
        const courierDetails = await CourierDetails.find({});
        res.status(200).json(courierDetails);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})
const getCourierDetail = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const courierdetails = await CourierDetails.findById(id);
        res.status(200).json(courierdetails);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});
const createCourier = asyncHandler(async(req,res)=>{
    try {
        const courierDetails = await CourierDetails.create(req.body)
        res.status(200).json(courierDetails);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
        
    }
})

const updateCourier = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        const courierDetails = await CourierDetails.findByIdAndUpdate(id,req.body);
        if(!courierDetails){
            res.status(404);
            throw new Error(`Cannot Find the Courier ${id}`);
        }
        const updateCourier = await CourierDetails.findById(id);
        res.status(200).json(updateCourier);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
        
    }
});

const deleteCourier = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        const courierDetails = await CourierDetails.findByIdAndDelete(id);
        if(!courierDetails){
            res.status(404);
            throw new Error (`Cannot find the ID ${id}`);

        }
        res.status(200).json(courierDetails);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})
const getCourierByField = asyncHandler(async(req,res)=>{
    const {field,value}= req.query;
    try {
        if(!Array.isArray(field)||!Array.isArray(value)){
            res.status(400).json({error:"Fields must be in Array"});
            return;
        }
        const query ={};
        field.forEach((f,index)=>{
            query[f]= value[index];
        });
        const users = await CourierDetails.find(query);
        res.json(users);
    } catch (error) {
        res.status(500).json({error:message})
        
    }
});
  

module.exports=
{
    getCourierDetails,
    createCourier,
    updateCourier,
    deleteCourier,
    getCourierByField,
    getCourierDetail,
    
}