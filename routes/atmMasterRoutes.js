const express = require("express");
const router = express.Router();
const {getCourierDetails,getCourierByField,getCourierDetail,createCourier,updateCourier,deleteCourier,getRouteDetails,getRouteDetailByName,getAtmCountByMspAndBank,getFilteredAtmCount,getDistinctFieldValues,getGroupedCounts}= require("../controller/atmMasterController");

router.get("/",getCourierDetails);
router.get("/search",getCourierByField);
router.get("/routes",getRouteDetails);
router.get("/routes/:id",getRouteDetailByName);
router.get("/routes/:mspAccount/:bankCode",getAtmCountByMspAndBank);
router.get("/atmcount",getFilteredAtmCount);
router.get("/atmdistinct",getDistinctFieldValues);
router.get("/atmgroups",getGroupedCounts);
router.get("/:id",getCourierDetail);
router.put("/:id",updateCourier);
router.delete("/:id",deleteCourier);
router.post("/",createCourier);

module.exports = router;
