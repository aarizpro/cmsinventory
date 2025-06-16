const express = require("express");
const router = express.Router();
const {
  createIndent,
  getAllIndents,
  getIndentById,
  updateIndent,
  deleteIndent,
  deleteByDate,
  uploadCsv, uploadCsvData,
  getDistinctFields,
  getFilteredData,
  getActivityAbstract
} = require("../controller/indentController");

// Routes
router.post("/", createIndent);
router.get("/", getAllIndents);
router.get("/distinct-fields", getDistinctFields);
router.get("/filtered-data", getFilteredData);
router.get("/activity-abstract", getActivityAbstract);
router.get("/:id", getIndentById);
router.put("/:id", updateIndent);
router.delete("/:id", deleteIndent);
router.delete("/delete-by-date/:date", deleteByDate);
router.post("/upload", uploadCsv, uploadCsvData);

module.exports = router;
