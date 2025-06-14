const express = require("express");
const router = express.Router();
const {
  getCourierDetails,
  getCourierDetail,
  createCourier,
  updateCourier,
  deleteCourier,
  getEmployeeDetailsById
} = require("../controller/employeeController");

// Place these first
router.get("/search", getEmployeeDetailsById);
router.get("/search/:empId", getEmployeeDetailsById);

// Then this (catch-all last)
router.get("/:id", getCourierDetail);

router.put("/:id", updateCourier);
router.delete("/:id", deleteCourier);
router.post("/", createCourier);
router.get("/", getCourierDetails);

module.exports = router;
