const CourierDetails = require("../model/mainVaultLedger")
const asyncHandler = require("express-async-handler");
const moment = require("moment");

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
const getCourierByField = asyncHandler(async (req, res) => {
  try {
    const { binId, dateOfCmo } = req.query;

    if (!binId || !dateOfCmo) {
      return res.status(400).json({ error: "Both 'binId' and 'dateOfCmo' are required." });
    }

   
    const results = await CourierDetails.find({
      binId: binId.trim(),           // remove whitespace if any
      dateOfCmo: dateOfCmo.trim(),   // remove whitespace if any
    });

    
    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const getEntriesByBinAndDate = asyncHandler(async (req, res) => {
  try {
    const { binId, dateOfCmo } = req.query;

    // Input validation
    if (!binId || !dateOfCmo) {
      return res.status(400).json({ error: "Both binId and dateOfCmo are required." });
    }

    // Query the database
    const entries = await CourierDetails.find({
      binId: binId.trim(),
      dateOfCmo: dateOfCmo.trim(),
    });

    // Optional: handle no results
    if (entries.length === 0) {
      return res.status(404).json({ message: "No entries found for the given bin and date." });
    }

    res.status(200).json(entries);
  } catch (error) {
    console.error("❌ Error fetching vault entries:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getGroupedVaultData = async (req, res) => {
    try {
      const { binId, amountType, dateOfCmo } = req.query;
  
      const match = {};
      if (binId) match.binId = binId;
      if (amountType) match.amountType = amountType;
      if (dateOfCmo) match.dateOfCmo = dateOfCmo; // direct match
  
      const groupedData = await CourierDetails.aggregate([
        { $match: match },
        {
          $group: {
            _id: {
              binId: "$binId",
              amountType: "$amountType",
              dateOfCmo: "$dateOfCmo"
            },
            totalDeno500: { $sum: "$deno500" },
            totalDeno200: { $sum: "$deno200" },
            totalDeno100: { $sum: "$deno100" },
            totalDenoOnes: { $sum: "$denoOnes" },
          },
        },
        {
          $sort: { "_id.dateOfCmo": -1 },
        },
      ]);
  
      res.status(200).json(groupedData);
    } catch (err) {
      console.error("Error in grouping ledger data:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const getNetVaultSummary = async (req, res) => {
    try {
      const result = await CourierDetails.aggregate([
        {
          $group: {
            _id: {
              dateOfCmo: "$dateOfCmo", // already string
              binId: "$binId",
              amountType: "$amountType"
            },
            total500: { $sum: "$deno500" },
            total200: { $sum: "$deno200" },
            total100: { $sum: "$deno100" },
            totalOnes: { $sum: "$denoOnes" }
          }
        },
        {
          $group: {
            _id: {
              dateOfCmo: "$_id.dateOfCmo",
              binId: "$_id.binId"
            },
            credit500: {
              $sum: {
                $cond: [{ $eq: ["$_id.amountType", "Credit"] }, "$total500", 0]
              }
            },
            credit200: {
              $sum: {
                $cond: [{ $eq: ["$_id.amountType", "Credit"] }, "$total200", 0]
              }
            },
            credit100: {
              $sum: {
                $cond: [{ $eq: ["$_id.amountType", "Credit"] }, "$total100", 0]
              }
            },
            creditOnes: {
              $sum: {
                $cond: [{ $eq: ["$_id.amountType", "Credit"] }, "$totalOnes", 0]
              }
            },
            debit500: {
              $sum: {
                $cond: [{ $eq: ["$_id.amountType", "Debit"] }, "$total500", 0]
              }
            },
            debit200: {
              $sum: {
                $cond: [{ $eq: ["$_id.amountType", "Debit"] }, "$total200", 0]
              }
            },
            debit100: {
              $sum: {
                $cond: [{ $eq: ["$_id.amountType", "Debit"] }, "$total100", 0]
              }
            },
            debitOnes: {
              $sum: {
                $cond: [{ $eq: ["$_id.amountType", "Debit"] }, "$totalOnes", 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            dateOfCmo: "$_id.dateOfCmo",
            binId: "$_id.binId",
            net500: { $subtract: ["$credit500", "$debit500"] },
            net200: { $subtract: ["$credit200", "$debit200"] },
            net100: { $subtract: ["$credit100", "$debit100"] },
            netOnes: { $subtract: ["$creditOnes", "$debitOnes"] }
          }
        },
        { $sort: { dateOfCmo: -1, binId: 1 } }
      ]);
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in fetching net vault summary:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  const getLedgerSummary = asyncHandler(async (req, res) => {
    try {
      const summary = await CourierDetails.aggregate([
        {
          $group: {
            _id: { dateOfCmo: "$dateOfCmo", amountType: "$amountType" },
            totalDeno500: { $sum: "$deno500" },
            totalDeno200: { $sum: "$deno200" },
            totalDeno100: { $sum: "$deno100" },
            totalDenoOnes: { $sum: "$denoOnes" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.dateOfCmo": 1 }
        }
      ]);
  
      res.status(200).json(summary);
    } catch (error) {
      res.status(500);
      throw new Error("Error aggregating ledger data: " + error.message);
    }
  });
  const getLedgerBalanceByDate = asyncHandler(async (req, res) => {
    const { date } = req.query; // e.g. /ledger/balance?date=07/04/2025
  
    if (!date || !moment(date, "DD/MM/YYYY", true).isValid()) {
      return res.status(400).json({ message: "Invalid or missing date. Use DD/MM/YYYY format." });
    }
  
    const today = date;
    const yesterday = moment(date, "DD/MM/YYYY").subtract(1, "days").format("DD/MM/YYYY");
    console.log("🔍 Yesterday:", yesterday);
    const groupFields = {
      totalDeno500: { $sum: "$deno500" },
      totalDeno200: { $sum: "$deno200" },
      totalDeno100: { $sum: "$deno100" },
      totalDenoOnes: { $sum: "$denoOnes" },
    };
  
    // ✅ Use correct model here
    const aggregateData = async (filter) => {
      const result = await CourierDetails.aggregate([
        { $match: filter },
        { $group: { _id: null, ...groupFields } },
      ]);
      return result[0] || {
        totalDeno500: 0,
        totalDeno200: 0,
        totalDeno100: 0,
        totalDenoOnes: 0,
      };
    };
  
    // ✅ Opening Balance (yesterday)
    const openingCredit = await aggregateData({ dateOfCmo: yesterday, amountType: "Credit" });
    const openingDebit = await aggregateData({ dateOfCmo: yesterday, amountType: "Debit" });
  
    const openingBalance = {
      deno500: openingCredit.totalDeno500 - openingDebit.totalDeno500,
      deno200: openingCredit.totalDeno200 - openingDebit.totalDeno200,
      deno100: openingCredit.totalDeno100 - openingDebit.totalDeno100,
      denoOnes: openingCredit.totalDenoOnes - openingDebit.totalDenoOnes,
    };
  
    // ✅ Today's Credit & Debit
    const todaysCredit = await aggregateData({ dateOfCmo: today, amountType: "Credit" });
    const todaysDebit = await aggregateData({ dateOfCmo: today, amountType: "Debit" });
  
    // ✅ Closing Balance = Opening + Today's Credit - Today's Debit
    const closingBalance = {
      deno500: openingBalance.deno500 + todaysCredit.totalDeno500 - todaysDebit.totalDeno500,
      deno200: openingBalance.deno200 + todaysCredit.totalDeno200 - todaysDebit.totalDeno200,
      deno100: openingBalance.deno100 + todaysCredit.totalDeno100 - todaysDebit.totalDeno100,
      denoOnes: openingBalance.denoOnes + todaysCredit.totalDenoOnes - todaysDebit.totalDenoOnes,
    };
  
    res.status(200).json({
      openingBalance,
      todaysCredit,
      todaysDebit,
      closingBalance,
    });
  });
  const getLedgerBalanceByBinAndDate = asyncHandler(async (req, res) => {
    const { date, binId } = req.query; // e.g. /ledger/balance/bin?date=07/04/2025&binId=CMS-ICICI
  
    if (!date || !moment(date, "DD/MM/YYYY", true).isValid()) {
      return res.status(400).json({ message: "Invalid or missing date. Use DD/MM/YYYY format." });
    }
  
    if (!binId) {
      return res.status(400).json({ message: "Missing binId in query." });
    }
  
    const today = date;
    const yesterday = moment(date, "DD/MM/YYYY").subtract(1, "days").format("DD/MM/YYYY");
    
  
    const groupFields = {
      totalDeno500: { $sum: "$deno500" },
      totalDeno200: { $sum: "$deno200" },
      totalDeno100: { $sum: "$deno100" },
      totalDenoOnes: { $sum: "$denoOnes" },
    };
  
    const aggregateData = async (filter) => {
      const result = await CourierDetails.aggregate([
        { $match: filter },
        { $group: { _id: "$binId", ...groupFields } },
      ]);
      const matched = result.find(item => item._id === binId);
      return matched || {
        totalDeno500: 0,
        totalDeno200: 0,
        totalDeno100: 0,
        totalDenoOnes: 0,
      };
    };
  
    // Opening balance (yesterday)
    const openingCredit = await aggregateData({ dateOfCmo: yesterday, amountType: "Credit", binId });
    const openingDebit = await aggregateData({ dateOfCmo: yesterday, amountType: "Debit", binId });
  
    const openingBalance = {
      deno500: openingCredit.totalDeno500 - openingDebit.totalDeno500,
      deno200: openingCredit.totalDeno200 - openingDebit.totalDeno200,
      deno100: openingCredit.totalDeno100 - openingDebit.totalDeno100,
      denoOnes: openingCredit.totalDenoOnes - openingDebit.totalDenoOnes,
    };
  
    // Today's credit and debit
    const todaysCredit = await aggregateData({ dateOfCmo: today, amountType: "Credit", binId });
    const todaysDebit = await aggregateData({ dateOfCmo: today, amountType: "Debit", binId });
  
    // Closing balance
    const closingBalance = {
      deno500: openingBalance.deno500 + todaysCredit.totalDeno500 - todaysDebit.totalDeno500,
      deno200: openingBalance.deno200 + todaysCredit.totalDeno200 - todaysDebit.totalDeno200,
      deno100: openingBalance.deno100 + todaysCredit.totalDeno100 - todaysDebit.totalDeno100,
      denoOnes: openingBalance.denoOnes + todaysCredit.totalDenoOnes - todaysDebit.totalDenoOnes,
    };
  
    res.status(200).json({
      binId,
      openingBalance,
      todaysCredit,
      todaysDebit,
      closingBalance,
    });
  });
  

module.exports=
{
    getCourierDetails,
    createCourier,
    updateCourier,
    deleteCourier,
    getCourierByField,
    getCourierDetail,
    getGroupedVaultData,
    getNetVaultSummary,
    getLedgerSummary,
    getLedgerBalanceByDate,
    getLedgerBalanceByBinAndDate,
    getEntriesByBinAndDate
}
