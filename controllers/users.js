
const User = require("../models/user.js");

module.exports.signUpForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signsUp = async(req,res)=>{
    try{
    let {username,email,password}=req.body.user
    const newUser =new User({email,username});
    const newuser=await User.register(newUser,password);
    // console.log(newUser);
    req.login(newuser,(err)=>{ // it automatically logins the newly signed up user! req.login takes a callback and the newly signed up user as parameters.
        if(err){
            return next(err);
        }
        req.flash("success","You logged In successfully!");
        res.redirect("/listings")
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
}

module.exports.logInForm =  (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.logsIn = (req,res)=>{
    req.flash("success","Welcomebak to WanderLust!")
    let redirectUrl = res.locals.redirectUrl || "/listings" // this is required if euser logins directly from /login page
    res.redirect(redirectUrl)
}

module.exports.logsOut = (req,res)=>{
    req.logout((err)=>{  // req.logout takes a callback as parameter which is a  error, genrally no error comes!
        if(err){
        next(err);
        }
        req.flash("success","You loggedOut successfully!");
        res.redirect("/listings")
    })
}
