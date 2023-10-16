const {Employer, User, Job} = require ("../model/db");
const {asynErrHand} = require ("../ErrorHandler/asynErrHand");
const jwt = require ("jsonwebtoken");

module.exports.authorized = asynErrHand(async (req, res, next) => {
 const token = req.cookies.authorization
 if(!token) {
  const script = "<script> alert ('Authentication failed, please log in'); window.location.href = '/auth/employer/login'</script>";
  return res.send(script)
 };
  const decodedData = jwt.verify(token, process.env.SecretKey);
  const employer = await Employer.findById(decodedData._id).populate("jobsPosted");
  if (!employer){
   const script ="<script> alert ('Please login to continue, if you are an employer'; windows.location.href = '/auth/employer/login'</script>"
   return res.send(script)
  }
  const iat = decodedData.iat * 1000;
  const update = new Date(employer.lastChangedPassword).getTime();
  if (iat < update) {
   const script = "<script> alert ('Authentication failed!'); window.location.href = '/auth/employer/login'</script>";
  return res.send(script);
  };
  req.user = employer;
  next()
})


module.exports.authorizedUser = asynErrHand(async (req, res, next) => {
 const token = req.cookies.authorization
 if(!token) {
  const script = "<script> alert ('Authentication failed, please log in'); window.location.href = '/auth/user/login'</script>";
  return res.send(script)
 };
  const decodedData = jwt.verify(token, process.env.SecretKey);
  const user = await User.findById(decodedData._id).populate("jobsAppliedFor");
  if (!user){
   const script ="<script> alert ('Please login to continue, if you are a user'; windows.location.href = '/auth/user/login'</script>"
   return res.send(script)
  }
  const iat = decodedData.iat * 1000;
  const update = new Date(user.lastChangedPassword).getTime();
  if (iat < update) {
  const script = "<script> alert ('Authentication failed!'); window.location.href = '/auth/user/login'</script>";
  return res.send(script);
  }
  req.user = user;
  next()
})