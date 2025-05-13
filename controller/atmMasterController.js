const CourierDetails = require("../model/atmMasterModel")
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
const getRouteDetails = asyncHandler(async(req,res)=>{
    
    try {
        const result = await CourierDetails.aggregate([
            {
              $group: {
                _id: "$routeName",
                count: { $sum: 1 }
              }
            },
            {
              $sort: { count: -1 }
            }
          ]);
      
          res.status(200).json(result);

    } catch (error) {
        res.status(500).json({error:message})
        
    }
});
const getRouteDetailByName = asyncHandler(async (req, res) => {
    let { id } = req.params;
    try {
        const result = await CourierDetails.aggregate([
          
          {
            $match: {
              routeName: id
            }
          },
          {
            $group: {
              _id: "$routeName",
              count: { $sum: 1 }
            }
          }
        ]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Route not found' });
          }
      
          res.status(200).json(result[0]);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
  });
  
  const getAtmCountByMspAndBank = asyncHandler(async (req, res) => {
    const { mspAccount, bankCode } = req.params;
  
    if (!mspAccount || !bankCode) {
      return res.status(400).json({ error: "Both mspAccount and bankCode are required" });
    }
  
    try {
      const result = await CourierDetails.aggregate([
        {
          $match: {
            mspAccount: { $regex: `^${mspAccount}$`, $options: "i" },
            bankCode: { $regex: `^${bankCode}$`, $options: "i" },
          },
        },
        {
          $group: {
            _id: {
              mspAccount: "$mspAccount",
              bankCode: "$bankCode"
            },
            count: { $sum: 1 }
          },
        },
      ]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No data found for given mspAccount and bankCode" });
      }
  
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  const getFilteredAtmCount = asyncHandler(async (req, res) => {
    try {
      const {
        mspAccount,
        bankCode,
        hubLocation,
        atmCategory,
        atmType,
        model,
        siteCode,
        cashLoadingType,
        routeName
      } = req.query;
  
      // Create a dynamic filter
      const filter = {};
  
      if (mspAccount && mspAccount !== 'ALL') filter.mspAccount = mspAccount;
      if (bankCode && bankCode !== 'ALL') filter.bankCode = bankCode;
      if (hubLocation && hubLocation !== 'ALL') filter.hubLocation = hubLocation;
      if (atmCategory && atmCategory !== 'ALL') filter.atmCategory = atmCategory;
      if (atmType && atmType !== 'ALL') filter.atmType = atmType;
      if (model && model !== 'ALL') filter.model = model;
      if (siteCode && siteCode !== 'ALL') filter.siteCode = siteCode;
      if (cashLoadingType && cashLoadingType !== 'ALL') filter.cashLoadingType = cashLoadingType;
      if (routeName && routeName !== 'ALL') filter.routeName = routeName;
  
      // Query DB
      const count = await CourierDetails.countDocuments(filter); // <-- Fixed here
  
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const getDistinctFieldValues = asyncHandler(async (req, res) => {
    try {
      const fields = [
        "mspAccount",
        "bankCode",
        "hubLocation",
        "atmCategory",
        "atmType",
        "model",
        "siteCode",
        "cashLoadingType",
        "routeName"
      ];
  
      const result = {};
  
      // Fetch distinct values for each field
      for (const field of fields) {
        result[field] = await CourierDetails.distinct(field);
      }
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  const getGroupedCounts = async (req, res) => {
    try {
      const {
        mspAccount,
        bankCode,
        hubLocation,
        atmCategory,
        atmType,
        model,
        siteCode,
        cashLoadingType,
        routeName
      } = req.query;
  
      const filter = {};
      if (mspAccount) filter.mspAccount = mspAccount;
      if (bankCode) filter.bankCode = bankCode;
      if (hubLocation) filter.hubLocation = hubLocation;
      if (atmCategory) filter.atmCategory = atmCategory;
      if (atmType) filter.atmType = atmType;
      if (model) filter.model = model;
      if (siteCode) filter.siteCode = siteCode;
      if (cashLoadingType) filter.cashLoadingType = cashLoadingType;
      if (routeName) filter.routeName = routeName;
  
      const results = await CourierDetails.aggregate([
        { $match: filter },
        {
          $facet: {
            mspAccount: [
              { $group: { _id: "$mspAccount", count: { $sum: 1 } } },
            ],
            hubLocation: [
              { $group: { _id: "$hubLocation", count: { $sum: 1 } } },
            ],
            bankCode: [
              { $group: { _id: "$bankCode", count: { $sum: 1 } } },
            ],
            atmCategory: [
              { $group: { _id: "$atmCategory", count: { $sum: 1 } } },
            ],
            atmType: [
              { $group: { _id: "$atmType", count: { $sum: 1 } } },
            ],
            model: [
              { $group: { _id: "$model", count: { $sum: 1 } } },
            ],
            siteCode: [
              { $group: { _id: "$siteCode", count: { $sum: 1 } } },
            ],
            cashLoadingType: [
              { $group: { _id: "$cashLoadingType", count: { $sum: 1 } } },
            ],
            routeName: [
              { $group: { _id: "$routeName", count: { $sum: 1 } } },
            ]
          }
        }
      ]);
  
      res.json(results[0]);
    } catch (error) {
      console.error("Aggregation error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

module.exports=
{
    getCourierDetails,
    createCourier,
    updateCourier,
    deleteCourier,
    getCourierByField,
    getCourierDetail,
    getRouteDetails,
    getRouteDetailByName,
    getAtmCountByMspAndBank,
    getFilteredAtmCount,
    getDistinctFieldValues,
    getGroupedCounts
}