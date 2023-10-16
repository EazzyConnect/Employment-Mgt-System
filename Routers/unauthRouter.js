const express = require ("express");
const app = express();
const router = express.Router();
const {Employer, User, Job} = require ("../model/db");
const { getAllJobs, getAJob } = require("../controllers/unauth");

app.use(express.json());
router.use(express.json());

// GET ALL JOBS
router.get("/all-jobs", getAllJobs)

// GET A JOB
router.get("/all-jobs/:title", getAJob)

module.exports = router