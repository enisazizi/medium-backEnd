const { Schema, model } = require("mongoose")

const UserSchema = new Schema({
  name: String,
  surname: String,
})

module.exports = model("User", UserSchema)
