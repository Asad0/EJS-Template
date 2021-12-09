const mongo=require("mongoose");
require('dotenv').config()
mongo.connect(process.env.MONGO_DB_URL).then(()=>{console.log("database Connected ")})
module.exports=mongo;