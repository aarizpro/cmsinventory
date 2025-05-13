const express = require("express");
const { createUser, authUser, testUser,getUserDetail } = require("../controller/userController");

const router = express.Router();

router.post("/", createUser);       // POST to create user
router.post("/auth", authUser);     // POST to authenticate user
router.get("/test", testUser);      // GET for test
router.get("/:id", getUserDetail);      // GET for test

module.exports = router;
