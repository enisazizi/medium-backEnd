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
            // required:true,
        },
        category:{
            type:String,
            // required:true,
        },
    //  author:{
    //         name:String,
    //         img:String,

    //     },
        cover:{
            type:String,
            // required:true,
        },
        reviews:[{
            text:String,
            user:String,
            // _id:Object,
            //{"headLine":"Iphone","subHead":"X","authors":"60004e2c62c39217bcfedff8"}

        }],
        authors:[{type:Schema.Types.ObjectId,ref: "Author"}],
        claps : [{type:Schema.Types.ObjectId,ref:"User"}]

    },
    { timestamps: true }
)
ArticleSchema.static("addUserToClaps", async function(articleId,userId){
    await ArticleSchema.findOneAndUpdate(
       { _id:articleId},

        {
            $addToSet : {claps:userId},
        }

    )
})

//const ArticleModel = model("Artcile",ArticleSchema)
//module.exports = ArticleModel
module.exports = mongoose.model("Article",ArticleSchema)