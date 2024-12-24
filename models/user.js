const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
})
// passportLocalMongoose automatically craetes username pass hash it and salt it


userSchema.plugin(passportLocalMongoose);



const User = mongoose.model("User",userSchema);

module.exports = User;
