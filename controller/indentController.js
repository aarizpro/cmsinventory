const Indent = require("../model/indentModel");

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const dayjs = require("dayjs");
// Multer to handle file upload
const upload = multer({ dest: "uploads/" });
const uploadCsv = upload.single("file");

function formatToMatch(dateStr) {
    return dayjs(dateStr).format("DD-MMM-YY");
  }

const REQUIRED_COLUMNS = ["ATMID", "Date"]
// Create new indent
const createIndent = async (req, res) => {
  try {
    const indent = await Indent.create(req.body);
    res.status(201).json(indent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadCsvData = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }
  
      const filePath = req.file.path;
      const indents = [];
      const skipped = [];
  
      const stream = fs.createReadStream(filePath).pipe(csv());
  
      stream.on("data", (row) => {
        // Validate required columns
        const hasAllRequired = REQUIRED_COLUMNS.every(col => row[col]?.trim());
        if (!hasAllRequired) {
          skipped.push({ reason: "Missing required fields", row });
          return;
        }
  
        // Prepare row
        const indentEntry = {
          CompanyCode: row["CompanyCode"],
          ZoneName: row["ZoneName"],
          Region: row["Region"],
          Location: row["Location"],
          HubLocation: row["HubLocation"],
          SubLocation: row["SubLocation"],
          AccountMSP: row["Account/MSP"],
          BankCode: row["BankCode"],
          Date: row["Date"],
          AddCashCassetteSwap: row["Add Cash/Cassette Swap"],
          ATMID: row["ATMID"],
          AtmType: row["AtmType"],
          RouteCode: row["RouteCode"],
          CFRNo: row["CFR No"],
          IndentNo: row["Indent No"],
          InitialIndent2000: +row["Initial Indent 2000"] || 0,
          InitialIndent500: +row["Initial Indent 500"] || 0,
          InitialIndent200: +row["Initial Indent 200"] || 0,
          InitialIndent100: +row["Initial Indent 100"] || 0,
          InitialIndent50: +row["Initial Indent 50"] || 0,
          InitialIndent20: +row["Initial Indent 20"] || 0,
          InitialIndent10: +row["Initial Indent 10"] || 0,
          InitialIndentTotal: +row["Initial Indent Total"] || 0,
          FinalIndent2000: +row["Final Indent 2000"] || 0,
          FinalIndent500: +row["Final Indent 500"] || 0,
          FinalIndent200: +row["Final Indent 200"] || 0,
          FinalIndent100: +row["Final Indent 100"] || 0,
          FinalIndent50: +row["Final Indent 50"] || 0,
          FinalIndent20: +row["Final Indent 20"] || 0,
          FinalIndent10: +row["Final Indent 10"] || 0,
          FinalIndentTotal: +row["Final Indent Total"] || 0,
          Loading2000: +row["Loading 2000"] || 0,
          Loading500: +row["Loading 500"] || 0,
          Loading200: +row["Loading 200"] || 0,
          Loading100: +row["Loading 100"] || 0,
          Loading50: +row["Loading 50"] || 0,
          Loading20: +row["Loading 20"] || 0,
          Loading10: +row["Loading 10"] || 0,
          LoadingTotal: +row["Loading Total"] || 0,
          Difference: +row["Difference"] || 0,
          Remarks: row["Remarks"],
          Card: row["Card"],
          InitialIndentAmount: +row["Initial Indent Amount"] || 0,
          LastIndentRevisedReason: row["Last Indent Revised Reason"],
          IndentUploadedBy: row["Indent Uploaded By"],
          RevisedBy: row["RevisedBy"],
          ClosedByApp: row["Closed By App"],
          ClosedByWeb: row["Closed By Web"],
          Status: row["Status"],
          EntryDoneSource: row["Entry Done Source"],
          IndentUploadedDate: row["Indent Uploaded Date"],
          IndentUploadedTime: row["Indent Uploaded Time"],
          EntryDate: row["Entry Date"],
          EntryTime: row["Entry Time"],
          Activity: row["Activity"],
          IFSCCode: row["IFSCCode"],
          RevisedDate: row["Revised Date"],
          RevisedTime: row["Revised Time"],
          ETATimeHour: row["ETATimeHour"],
          ETATimeMinute: row["ETATimeMinute"],
          ETARemark: row["ETARemark"]
        };
  
        indents.push(indentEntry);
      });
  
      stream.on("end", async () => {
        let insertedCount = 0;
        let duplicateCount = 0;
  
        for (let indent of indents) {
          const exists = await Indent.findOne({
            ATMID: indent.ATMID,
            Date: indent.Date
          });
  
          if (exists) {
            duplicateCount++;
            skipped.push({ reason: "Duplicate", indent });
          } else {
            await Indent.create(indent);
            insertedCount++;
          }
        }
  
        fs.unlinkSync(filePath);
  
        res.status(201).json({
          message: "CSV processed",
          inserted: insertedCount,
          duplicates: duplicateCount,
          skipped: skipped.length
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
// Get all indents
const getAllIndents = async (req, res) => {
  try {
    const indents = await Indent.find();
    res.status(200).json(indents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get indent by ID
const getIndentById = async (req, res) => {
  try {
    const indent = await Indent.findById(req.params.id);
    if (!indent) return res.status(404).json({ error: "Indent not found" });
    res.status(200).json(indent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update indent by ID
const updateIndent = async (req, res) => {
  try {
    const updated = await Indent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Indent not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete indent by ID
const deleteIndent = async (req, res) => {
  try {
    const deleted = await Indent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Indent not found" });
    res.status(200).json({ message: "Indent deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteByDate = async (req, res) => {
    try {
      const date = req.params.date; // e.g., "15-06-2025"
      const result = await Indent.deleteMany({ IndentUploadedDate: date });
      res.status(200).json({ deletedCount: result.deletedCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getFilteredData = async (req, res) => {
    try {
      const { startDate, endDate, ...filters } = req.query;
  
      // Convert startDate and endDate to "DD-MMM-YY" format to match stored strings
      const formatToMatch = (dateStr) => {
        return dayjs(dateStr).format("DD-MMM-YY");
      };
  
      const start = formatToMatch(startDate);
      const end = formatToMatch(endDate);
  
      const query = {
        IndentUploadedDate: { $gte: start, $lte: end },
        ...filters,
      };
  
      console.log("Final Query:", query);
  
      const result = await Indent.find(query);
      res.status(200).json(result);
    } catch (err) {
      console.error("Error in getFilteredData:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
const getActivityAbstract = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      Location,
      HubLocation,
      AccountMSP,
      BankCode,
      RouteCode,
      AddCashCassetteSwap,
      AtmType,
      IndentUploadedBy
    } = req.query;

    const filter = {};

    if (Location) filter.Location = Location;
    if (HubLocation) filter.HubLocation = HubLocation;
    if (AccountMSP) filter.AccountMSP = AccountMSP;
    if (BankCode) filter.BankCode = BankCode;
    if (RouteCode) filter.RouteCode = RouteCode;
    if (AddCashCassetteSwap) filter.AddCashCassetteSwap = AddCashCassetteSwap;
    if (AtmType) filter.AtmType = AtmType;
    if (IndentUploadedBy) filter.IndentUploadedBy = IndentUploadedBy;

    if (startDate && endDate) {
      filter.IndentUploadedDate = { $gte: startDate, $lte: endDate };
    }

    const results = await Indent.aggregate([
      { $match: filter },
      {
        $facet: {
          Location: [
            {
              $group: {
                _id: "$Location",
                YES_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "YES"] }, 1, 0] }
                },
                NO_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "NO"] }, 1, 0] }
                }
              }
            }
          ],
          HubLocation: [
            {
              $group: {
                _id: "$HubLocation",
                YES_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "YES"] }, 1, 0] }
                },
                NO_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "NO"] }, 1, 0] }
                }
              }
            }
          ],
          AccountMSP: [
            {
              $group: {
                _id: "$AccountMSP",
                YES_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "YES"] }, 1, 0] }
                },
                NO_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "NO"] }, 1, 0] }
                }
              }
            }
          ],
          BankCode: [
            {
              $group: {
                _id: "$BankCode",
                YES_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "YES"] }, 1, 0] }
                },
                NO_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "NO"] }, 1, 0] }
                }
              }
            }
          ],
          RouteCode: [
            {
              $group: {
                _id: "$RouteCode",
                YES_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "YES"] }, 1, 0] }
                },
                NO_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "NO"] }, 1, 0] }
                }
              }
            }
          ],
          AddCashCassetteSwap: [
            {
              $group: {
                _id: "$AddCashCassetteSwap",
                YES_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "YES"] }, 1, 0] }
                },
                NO_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "NO"] }, 1, 0] }
                }
              }
            }
          ],
          AtmType: [
            {
              $group: {
                _id: "$AtmType",
                YES_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "YES"] }, 1, 0] }
                },
                NO_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "NO"] }, 1, 0] }
                }
              }
            }
          ],
          IndentUploadedBy: [
            {
              $group: {
                _id: "$IndentUploadedBy",
                YES_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "YES"] }, 1, 0] }
                },
                NO_Count: {
                  $sum: { $cond: [{ $eq: ["$Activity", "NO"] }, 1, 0] }
                }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

  
  const getDistinctFields = async (req, res) => {
    try {
      const fields = [
        "Location",
        "HubLocation",
        "AccountMSP",
        "BankCode",
        "RouteCode",
        "AddCashCassetteSwap",
        "AtmType",
        "IndentUploadedBy"
      ];
  
      const distinctData = {};
  
      for (const field of fields) {
        distinctData[field] = await Indent.distinct(field);
      }
  
      res.status(200).json(distinctData);
    } catch (error) {
      res.status(500).json({ message: "Error getting distinct values", error });
    }
  };

module.exports = {
  createIndent,
  getAllIndents,
  getIndentById,
  updateIndent,
  deleteIndent,
  deleteByDate,
  uploadCsv,
  uploadCsvData,
  getDistinctFields,
  getFilteredData,
  getActivityAbstract

};
