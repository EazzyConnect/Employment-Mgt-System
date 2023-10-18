const mongoose = require ("mongoose");
const dotenv = require("dotenv")

require("dotenv").config()

const genderEnum = ["Male", "Female"];

const userSchema = new mongoose.Schema ({
 firstName: {required: true, type: String},
 lastName: {required: true, type: String},
 username: {required: true, type: String, unique: true},
 email: {required: true, type: String, unique: true},
 password: {required: true, type: String, minLength: 6},
 phone: {required: true, type: Number},
 gender: {type: String, enum: genderEnum},
 nationality: {type: String},
 address: {type: String},
 qualification:[{type: String}],
 experience: [{type: String}],
 skills: [{type: String}],
 socialLinks: [{type: String}],
 disability: [{type: String}],
 jobsAppliedFor: [{
  title:{type: String}}],
 createdOn: {type: Date, default: Date.now},
 lastChangedPassword: {type: Date, default: Date.now}
});

const employerSchema = new mongoose.Schema ({
 companyName: {required: true, type: String, unique: true},
 address: {required: true, type: String},
 website: {required: true, type: String, unique: true},
 phone: {required: true, type: Number, unique: true},
 email: {required: true, type: String, unique: true},
 password: {required: true, type: String, minLength: 6},
 approved: {type: Boolean, default: false},
 jobsPosted: {
  _id:{type: mongoose.Schema.ObjectId, ref: "jobs"},
 title: {type: String}
 },
 createdOn: {type: Date, default: Date.now},
 lastChangedPassword: {type: Date, default: Date.now}
});

const jobSchema = new mongoose.Schema ({
 title: {required: true, type: String},
 description: {required: true, type: String},
 experienceAndQualification: {required: true, type: String},
 link: {required: true, type: String},
 createdBy: {
  _id: {type: mongoose.Schema.ObjectId, ref: "employers"},
  companyName: {type: String},
  datePosted: {type: Date, default: Date.now}
 },
 closingDate: {required: true, type: String}
});

const Employer = new mongoose.model("employers", employerSchema);
const User = new mongoose.model("users", userSchema);
const Job = new mongoose.model("jobs", jobSchema);

const connection = async () => {
 const MongoDbUrl = process.env.MongoDbUrl
 await mongoose.connect(MongoDbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => console.log("Database is running"));
}

module.exports = {Employer, User, Job, genderEnum, connection}