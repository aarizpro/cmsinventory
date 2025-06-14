const express = require("express");
const router = express.Router();
const {getCourierDetails,getCourierByField,getCourierDetail,createCourier,updateCourier,deleteCourier}= require("../controller/binMasterController");

router.get("/",getCourierDetails);
router.get("/search",getCourierByField);
router.get("/:id",getCourierDetail);
router.put("/:id",updateCourier);
router.delete("/:id",deleteCourier);
router.post("/",createCourier);

module.exports = router;
