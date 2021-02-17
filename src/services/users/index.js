const express = require("express")
const mongoose = require("mongoose")
const UserSchema = require("./schema")

const usersRouter = express.Router()

usersRouter.post("/",async(req,res,next)=>{
    try {
        const newUser = new UserSchema(req.body)

        const { _id} = await newUser.save()
        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter