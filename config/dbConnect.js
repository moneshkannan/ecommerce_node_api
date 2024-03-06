const mongoose = require('mongoose')

const dbConnect = () => {
    try{
        const conn = mongoose.connect(process.env.MONGO_DB_URL)
        console.log("database connected successfully")
    }catch(err){
        throw new Error(err)
    }
}

module.exports = dbConnect