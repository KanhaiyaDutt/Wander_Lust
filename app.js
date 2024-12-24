// if(process.env.NODE_ENV !="production"){ // so that at deployment our credentials are not shared with the cloud service!
    require("dotenv").config();
// }


const express = require("express");
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js")
const listingRouter = require("./Routes/listings.js")
const reviewRouter = require("./Routes/reviews.js")
const session = require("express-session");
const MongoStore = require('connect-mongo')
const flash = require("connect-flash")
const passport = require("passport")
const LocalStratergy = require("passport-local")
const User = require("./models/user.js")
const userRouter = require("./Routes/users.js")

// MOngodb connection:
const dbUrl = process.env.ATLASDB;
main()
.then((res)=>{console.log("connected to db app")})
.catch((err)=>{console.log(err)})
async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}



app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
app.use(session(sessionOptions));
app.use(flash());

// Use passport always with and after session!
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// local varaibles: 
app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// Routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// // Home Route
// app.get("/",(req,res)=>{
//     res.send("I am Root")
// })

// Unknown Routes
app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"));
})

// Error Handler:
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went Wrong!!"} = err;
    res.status(statusCode).render("error.ejs",{err});
})

// connection to the server
app.listen(8080, ()=>{
    console.log("server is listening to port 8080")
})