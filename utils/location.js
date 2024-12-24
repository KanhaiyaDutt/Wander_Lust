const axios = require("axios")
const expressError = require("./expressError")

const api_key = process.env.G_MAPS_API


module.exports.getCoords =async (address)=>{


   const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${api_key}`)

   const data = response.data;

   if(!data || data.status === "ZERO_RESULTS"){
    const coordinates = "NOTDEFINED";
    return coordinates;
   }
   
   const coordinates = data.results[0].geometry.location;
   return coordinates;

}