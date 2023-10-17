const {Employer, User, Job} = require ("../model/db");
const {asynErrHand} = require ("../ErrorHandler/asynErrHand");
const bcrypt = require ("bcrypt");
const jwt = require ("jsonwebtoken");
require("dotenv").config();


// EMPLOYER SIGNUP 
module.exports.employerSignUp = asynErrHand(async (req, res) => {
 const {password, ...others} = req.body;
 if (password.length < 6){
 const script = "<script> alert ('Password length must be more than 5 characters'); window.location.href = '/auth/employer/signup' </script>";
 return res.send(script);
 }
 const hashedPassword = await bcrypt.hash (password, 3);
 const newEmployer = await Employer.create({...others, password: hashedPassword});
 // const token = jwt.sign({_id : newEmployer._id}, process.env.SecretKey);
 // res.cookie("authorization", token);
 if (newEmployer){
  const script = "<script> alert ('Registration Successful, Please Login To Continue'); window.location.href = '/auth/employer/login' </script>";
  res.send(script)
 }else {
  const script = "<script> alert ('Registration Failed'); window.location.href = '/auth/employer/signup' </script>";
  res.send(script)
 }
})

// USER SIGNUP
module.exports.userSignUp = asynErrHand (async (req, res) => {
 const {password, ...others} = req.body;
 if (password.length < 6){
  const script = "<sript> alert ('Password length must be more than 5 characters'); window.location.href = '/auth/user/signup' </script>";
  return res.send(script)
 }
 const hashedPassword = await bcrypt.hash (password, 3);
 const newUser = await User.create({...others, password: hashedPassword})
 // const token = jwt.sign({_id : newUser._id}, process.env.SecretKey)
 // res.cookie("authorization", token)
 if (newUser) {
  const script = "<script> alert ('Registration Successful, Please Login To Continue'); window.location.href = '/auth/user/login' </script>";
  res.send(script)
 }else {
  const script = "<script> alert ('Registration Failed'); window.location.href = '/auth/user/signup' </script>";
  res.send(script)
 }
})

// EMPLOYER SIGN-IN
module.exports.employerLogin = asynErrHand(async (req, res) => {
 const {email, password} = req.body;
 const employer = await Employer.findOne ({email});
 if (!employer){
  const script = "<script> alert ('No User Found'); window.location.href = '/auth/employer/login' </script>"
  return res.send (script);
 }
 const checkPassword = await bcrypt.compare (password, employer.password);
 if (!checkPassword){
  const script = "<script> alert ('Authentication Error'); window.location.href = '/auth/employer/login' </script>"
  return res.send (script);
 }
 const token = jwt.sign({_id: employer._id}, process.env.SecretKey);
 res.cookie("authorization", token);
return res.json ({ message: "Welcome, Login Successful", success: true, data: employer })
})

// USER SIGN-IN
module.exports.userLogin = asynErrHand(async (req, res) => {
 const {username, password} = req.body;
 const user = await User.findOne ({username});
 if (!user){
  const script = "<script> alert ('No User Found'); window.location.href = '/auth/user/login' </script>"
  return res.send (script);
 }
 const checkPassword = await bcrypt.compare (password, user.password);
 if (!checkPassword){
  const script = "<script> alert ('Authentication Error'); window.location.href = '/auth/user/login' </script>"
  return res.send (script);
 }
 const token = jwt.sign({_id: user._id}, process.env.SecretKey);
 res.cookie("authorization", token);
return res.json ({ message: "Welcome, Login Successful", success: true, data: user })
})

// LOGOUT
module.exports.logout = asynErrHand(async (_, res) => {
 res.cookie("authorization", "", {maxAge: 1});
 return res.json({message: "Logout Successful", success: true})
})

// CREATE JOB
module.exports.createJob = asynErrHand(async (req, res) => {
 const employer = await Employer.findById(req.user._id);
 if (!employer){
  const script = "<script> alert ('Employer not found'); window.location.href = 'auth/employer/post-job' </script>"
  return res.send(script)
 }
 const checkApproved = await Employer.findOne({companyName: req.user.companyName, approved: true})
 if(!checkApproved){
  const script = "<script> alert ('You are not allowed to post jobs yet, until you get approved'; window.location.href = 'auth/employer/home' </script>"
  return res.send(script)
 }
 const newJob = await Job.create({...req.body, createdBy: {_id: req.user._id, companyName: employer.companyName}});
 await Employer.updateOne({_id: req.user._id}, {$push: {jobsPosted: {_id: newJob.id,
 title: newJob.title}
}
});
 return res.json({job: newJob, message: "New job Successfully added", success: true})
})

// USER CHANGE PASSWORD
module.exports.UserChangePassword = asynErrHand (async (req, res) => {
 if(req.body.password.length < 6) {
  const script = "<script> alert ('Password must be greater than 5 characters'); window.location.href ='/auth/user/settings'</script>"
  return res.send(script);
 }
 const hashedPassword = await bcrypt.hash( req.body.password, 3);
 const update = await User.updateOne ({_id: req.user._id}, {password: hashedPassword, lastChangedPassword: Date.now()})
 if (update){
  res.cookie("authorization", "", {maxAge: 1});
  const script = "<script>alert('Password Changed Successfully. Please, Login to Continue'); window.location.href = '/auth/user/login' </script>";
return res.send(script);
}
})
// EMPLOYER CHANGE PASSWORD
module.exports.EmpChangePassword = asynErrHand (async (req, res) => {
 if(req.body.password.length < 6) {
  const script = "<script> alert ('Password must be greater than 5 characters'); window.location.href ='/auth/user/settings'</script>"
  return res.send(script);
 }
 const hashedPassword = await bcrypt.hash( req.body.password, 3);
 const update = await Employer.updateOne ({_id: req.user._id}, {password: hashedPassword, lastChangedPassword: Date.now()})
 if (update){
 res.cookie("authorization", "", {maxAge: 1});
 const script = "<script>alert('Password Changed Successfully. Please, Login to Continue'); window.location.href = '/auth/employer/login' </script>";
 return res.send(script);
}
})

// USER APPLY FOR JOB
module.exports.apply = asynErrHand( async (req, res) => {
 const requiredFields = ["firstName", "lastName","username","email","phone","gender","nationality","address"];
 const {title} = req.body;
 const missingFields = requiredFields.filter((field) => !req.user[field]);
 if (missingFields.length > 0){
  return res.status(400).json({
  message: `Please complete your profile. Missing fields: ${missingFields.join(', ')}`,
  success: false,
  });
 }
 const job = await Job.findOne({title});
 if (!job){
  return res.status(404).json({ message: "Job not found", success: false });
 }
 const requiredArrayFields = ["qualification", "experience", "skills", "socialLinks", "disability"];
 const emptyArrayFields = requiredArrayFields.filter((field) => {
  return Array.isArray(req.user[field]) && req.user[field].length === 0;
 });
 if (emptyArrayFields.length > 0) {
  return res.status(400).json({
  message: `Please provide information for the following fields: ${emptyArrayFields.join(', ')}`, success: false,
 })
};
 const addJob = req.user.jobsAppliedFor.push(job);
 await req.user.save();
 return res.json({ data: addJob, message: "Application submitted successfully", success: true });
});

// USER UPDATE PROFILE
module.exports.updateProfile = asynErrHand( async (req, res) => {
 const {phone, nationality, address, qualification, experience, skills, socialLinks, disability} = req.body;
 if(phone) req.user.phone = phone;
 if(nationality) req.user.nationality = nationality;
 if(address) req.user.address = address;
 if(qualification) {
  const existingQual = req.user.qualification || [];
  const newQual = qualification.split(",").map(qual => qual.trim());
  req.user.qualification = [...existingQual, ...newQual]
 };
 if(experience) {
  const existingExp = req.user.experience || [];
  const newExp = experience.split(",").map(exp => exp.trim());
  req.user.experience = [...existingExp, ...newExp]
 };
 if(skills) {
  const existingSkills = req.user.skills || [];
  const newSkill = skills.split(",").map(skill => skill.trim());
  req.user.skills = [...existingSkills, ...newSkill]
 };
 if(socialLinks) {
  const existingSocial = req.user.socialLinks || [];
  const newSocial = socialLinks.split(",").map(soc => soc.trim());
  req.user.socialLinks = [...existingSocial, ...newSocial]
 };
 if(disability) req.user.disability = disability;

 const updateUser = await req.user.save();
 if (updateUser) {
const script = "<script>alert('Update successful!'); window.location.href = '/auth/user/profile' </script>";
return res.send(script)
};
})

// GET USER'S PROFILE
module.exports.getProfile = asynErrHand(async (req, res) => {
  const findUser = await User.findById({_id: req.user._id})
  if(!findUser){
    const script = "<script> alert ('Authentication failed'); window.location.href = '/auth/user/login' </script>";
    return res.send(script)
  }
  return res.json({data: findUser, success: true})
})

// GET EMPLOYER'S PROFILE
module.exports.getEmployerProfile = asynErrHand(async (req, res) => {
  const findEmployer = await Employer.findById({_id: req.user._id})
  if(!findEmployer){
    const script = "<script> alert ('Aunthentication failed'); window.location.href = '/auth/employer/login' </script>";
    return res.send(script)
  }
  // console.log(`@empl`, findEmployer.jobsPosted);
  return res.json({data: findEmployer, success: true})
})

// EMPLOYER VIEW APPLICANTS
module.exports.viewApplicants = asynErrHand(async (req, res) => {
  const {title} = req.body
  const jobList = await Job.find({title});
  if (!jobList || jobList.length === 0){
  const script = "<script> alert ('No job found'); window.location.href = '/auth/employer/profile' </script>";
  return res.send(script);
}
  const applicants = await User.find({ "jobsAppliedFor.title": title }, "firstName lastName email");
  return res.json({ data: applicants});
})

// USER VIEW JOB APPLIED FOR
module.exports.userAppList = asynErrHand(async (req, res) => {
  const findJobs = await User.findById({_id: req.user._id}, "jobsAppliedFor")
  if(!findJobs || req.user.jobsAppliedFor.length === 0){
    const script = "<script> alert ('No job applied for yet'); window.location.href = '/auth/user/profile' </script>";
    return res.send(script)
  }
  return res.json({data: findJobs, success: true})
})

