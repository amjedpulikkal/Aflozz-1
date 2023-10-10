const express = require("express")
const morgan = require("morgan")
const adminRouter = require("./router/admin.js")
const userRouter = require("./router/user.js")
const ejslayout = require("express-ejs-layouts")
const nocache = require("nocache")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const app = express()


app.use(cookieParser());
app.use(session({
    secret: process.env.secret_key,
    resave: true,
    saveUninitialized: true,
  }));
  
app.use(ejslayout)
app.use(nocache())
app.use(express.static("public"))
app.use(morgan("dev"))
app.set("view engine","ejs")
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use("/admin",adminRouter)
app.use("/",userRouter)
app.all("/*",(req,res)=>res.render("404",{layout:"login/layout"}))


app.listen(process.env.PORT,()=>{
    console.log(`start ${process.env.PORT}`);
})