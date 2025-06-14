const express = require("express");
const router = express.Router();
const {
  getCourierDetails,
  getCourierByField,
  getCourierDetail,
  createCourier,
  updateCourier,
  deleteCourier,
  getGroupedVaultData,
  getNetVaultSummary,
  getLedgerSummary,
  getLedgerBalanceByDate,
  getLedgerBalanceByBinAndDate,
  getEntriesByBinAndDate
} = require("../controller/mainVaultLedgerController");

router.get("/", getCourierDetails);
router.get("/search", getCourierByField);
router.get("/bin", getEntriesByBinAndDate);
router.get("/typeabs", getGroupedVaultData);
router.get("/netsummary", getNetVaultSummary);
router.get("/summary", getLedgerSummary);
router.get("/balance", getLedgerBalanceByDate);
router.get("/balance/bin", getLedgerBalanceByBinAndDate);
router.get("/:id", getCourierDetail);
router.put("/:id", updateCourier);
router.delete("/:id", deleteCourier);
router.post("/", createCourier);

module.exports = router;
