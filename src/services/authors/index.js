const express = require("express")

const AuthorSchema = require("./schema")

const authorsRouter = express.Router()


authorsRouter.get("/",async(req,res,next)=>{
    try {
       const authors = await AuthorSchema.find() 
       res.send(authors)
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/:id",async(req,res,next)=>{
    try {
        const id = req.params.id
        const author = await AuthorSchema.findById(id)
        if(author){
            res.send(author)
        }else{
            const error = new Error()
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
})
authorsRouter.post("/",async(req,res,next)=>{
    try {
        const newAuthor = new AuthorSchema(req.body)
        const {_id} = await newAuthor.save()
        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

authorsRouter.put("/:id",async(req,res,next)=>{
    try {
        const id = req.params.id
        const author = await AuthorSchema.findByIdAndUpdate(id,req.body)
        if(author){
            res.send("OK")
        }else{
            const err = new Error()
            err.httpStatusCode = 404
            next(err)
        }
    } catch (error) {
        next(error)
    }
})
authorsRouter.delete("/:id",async(req,res,next)=>{
    try {
        const id = req.params.id
        const author = await AuthorSchema.findByIdAndDelete(id)
        if(author){
            res.send("Author Deleted")
        }else{
            const err = new Error
            err.httpStatusCode = 404
            next(err)

        }
    } catch (error) {
        next(error)
    }
})



module.exports = authorsRouter



