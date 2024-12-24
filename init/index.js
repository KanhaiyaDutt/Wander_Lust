const mongoose = require("mongoose")
const Listing = require("../models/Listing.js")
const initData = require("./data.js")


main()
.then((res)=>{console.log("connected to db")})
.catch((err)=>{console.log(err)})


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  }

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'67685409cd4840e8294cccbd'})) // adding owner
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}

initDB();