const express = require ("express");
const app = express();
const router = express.Router();
const {Employer, User, Job} = require ("../model/db");
const { employerSignUp, userSignUp, employerLogin, userLogin, logout, createJob, EmpChangePassword, UserChangePassword, apply, updateProfile, getProfile, getEmployerProfile, viewApplicants } = require("../controllers/auth");
const { authorized, authorizedUser } = require("../middleware/midAuth");

app.use(express.json());
router.use(express.json());

// EMPLOYER SIGN-UP
router.post("/employer/signup", employerSignUp);

// EMPLOYER LOGIN
router.post("/employer/login", employerLogin);

// USER SIGN-UP
router.post("/user/signup", userSignUp);

// USER LOGIN
router.post("/user/login", userLogin);

// LOGOUT
router.post("/logout", logout);

// EMPLOYER CREATE JOB
router.post("/employer/post-job", authorized,createJob)

// EMPLOYER CHANGE PASSWORD
router.post("/employer/settings", authorized, EmpChangePassword)

// USER CHANGE PASSWORD
router.post("/user/settings", authorizedUser, UserChangePassword)

// UPDATE USER
router.post("/user/update", authorizedUser, updateProfile)

// USER APPLY FOR JOB
router.post("/user/apply", authorizedUser, apply)

// USER'S PROFILE
router.get("/user/profile", authorizedUser, getProfile)

// EMPLOYER'S PROFILE
router.get("/employer/profile", authorized, getEmployerProfile)

// VIEW APPLICANTS
router.get("/employer/jobs-applicants", authorized, viewApplicants)

module.exports = router;