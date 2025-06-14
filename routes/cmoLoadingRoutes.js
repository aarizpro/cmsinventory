// routes/cmoLoadingRoutes.js
const express = require("express");
const router = express.Router();
const {
  createCMOEntry,
  getAllCMOEntries,
  getCMOEntryById,
  updateCMOEntry,
  deleteCMOEntry,
  searchCMOEntry
} = require("../controller/cmoLoadingController");

// Create Entry
router.post("/", createCMOEntry);

// Get All Entries
router.get("/", getAllCMOEntries);
router.get("/search", searchCMOEntry);
// Get Single Entry
router.get("/:id", getCMOEntryById);

// Update Entry
router.put("/:id", updateCMOEntry);

// Delete Entry
router.delete("/:id", deleteCMOEntry);

module.exports = router;
