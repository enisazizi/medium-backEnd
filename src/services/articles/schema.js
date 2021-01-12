const {Schema} = require("mongoose")
const mongoose = require("mongoose")

const ArticleSchema = new Schema(
    {
        headLine:{
            type:String,
            required:true,
        },
        subHead:{
            type:String,
            required:true,
        },
        content:{
            type:String,
            required:true,
        },
        category:{
            type:String,
            required:true,
        },
        author:{
            name:String,
            img:String,

        },
        cover:{
            type:String,
            required:true,
        },
       
    },
    { timestamps: true }
)


module.exports = mongoose.model("Article",ArticleSchema)