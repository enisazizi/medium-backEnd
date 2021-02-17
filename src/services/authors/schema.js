const { Schema, model } = require("mongoose")
const bcrypt = require("bcryptjs")

const AuthorSchema = new Schema({
  username: {
    type:String,
    required:true,
    unique:true,
  },
  password: {
    type:String,
    required:true,
  },
  refreshTokens: [
    {
      token: {
        type: String,
      },
    },
  ],
})


AuthorSchema.methods.toJSON = function(){
  const author = this 
  const authorObj = author.toObject()

  delete authorObj.password
  delete authorObj.__v

  return authorObj
}

AuthorSchema.statics.findByCredentials = async function(username,plainPw){
  const author = await this.findOne({username})

      if(author){
        const isMatch = await bcrypt.compare(plainPw,author.password)
        if(isMatch){
          return author
         }else{
           return null
         }
      }else{
        return null
      }
}

AuthorSchema.pre("save", async function(next){
  const author = this 
  const plainPw = author.password 

  if(author.isModified("password")){
    author.password = await bcrypt.hash(plainPw,10)
  }
  next()
})

module.exports = model("Author", AuthorSchema)
