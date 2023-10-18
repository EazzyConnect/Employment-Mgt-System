const express = require ("express");
const app = express ();
const {Employer, User, Job, connection} = require ("./model/db")
const authRouter = require ("./Routers/authRouter");
const unauthRouter = require ("./Routers/unauthRouter")
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv")
require("dotenv").config()

// app.use(express.json())

app.use(cookieParser())
app.use("/auth", authRouter)
app.use("/unauth", unauthRouter)

const PORT = process.env.PORT || 3999
const start = async () => {
 try {
  await connection();
  app.listen(PORT, console.log("Server is running on 3999"))
 } catch (error) {
  console.log(error.message)
 }
}

start()