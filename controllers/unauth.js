const {Employer, User, Job} = require ("../model/db");
const {asynErrHand} = require ("../ErrorHandler/asynErrHand");


// GET ALL JOBS
module.exports.getAllJobs = asynErrHand( async (req, res) => {
 const allJobs = await Job.find({});
 if (!allJobs || allJobs.length === 0){
  return res.json ({message: "No job posted yet."})
 }
 return res.json ({ data: allJobs, success: true})
})

// GET A JOB
module.exports.getAJob = asynErrHand( async (req, res) => {
 const title = req.params.title;
 const job = await Job.find({title}).populate("createdBy", "-password");
 if (!job || job.length === 0){
  return res.json ({message: "No job found"})
 }
 return res.json({data: job, success: true})

})