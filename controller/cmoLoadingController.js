// controllers/cmoLoadingController.js
const CMOLoading = require("../model/cmoLoadingModel");

// Create CMO Entry
const createCMOEntry = async (req, res) => {
  try {
    const newEntry = await CMOLoading.create(req.body);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Entries
const getAllCMOEntries = async (req, res) => {
  try {
    const entries = await CMOLoading.find().sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Entry
const getCMOEntryById = async (req, res) => {
  try {
    const entry = await CMOLoading.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Entry
const updateCMOEntry = async (req, res) => {
  try {
    const updated = await CMOLoading.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Entry
const deleteCMOEntry = async (req, res) => {
  try {
    const deleted = await CMOLoading.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Search Entries by dateofLoading and empId
const searchCMOEntry = async (req, res) => {
    try {
      const { date, empId } = req.query;
  
      if (!date || !empId) {
        return res.status(400).json({ message: "date and empId are required in query" });
      }
  
      const entries = await CMOLoading.find({
        dateofLoading: date,
        empId: empId
      }).sort({ createdAt: -1 });
  
      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = {
  createCMOEntry,
  getAllCMOEntries,
  getCMOEntryById,
  updateCMOEntry,
  deleteCMOEntry,
  searchCMOEntry
};
