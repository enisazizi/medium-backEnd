const { Schema, model } = require("mongoose")
const bcrypt = require("bcryptjs")

const AuthorSchema = new Schema(
  {
  
    name: String,
    surname: String,
    password: String,
    email: String,
    role: {
      type: String,
      enum: ["Admin", "User"],
    },
    refreshTokens: [{ token: { type: String } }],
    googleId: String,
  },
  { timestamps: true })


AuthorSchema.methods.toJSON = function(){
  const author = this 
  const authorObj = author.toObject()

  delete authorObj.password
  delete authorObj.__v

  return authorObj
}

AuthorSchema.statics.findByCredentials = async function(email,plainPw){
  const author = await this.findOne({email})

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

// passport-google-oauth20

AuthorSchema.pre("save", async function(next){
  const author = this 
  const plainPw = author.password 

  if(author.isModified("password")){
    author.password = await bcrypt.hash(plainPw,10)
  }
  next()
})

module.exports = model("Author", AuthorSchema)
