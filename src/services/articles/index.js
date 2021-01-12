const express = require("express")

const ArticleSchema = require("./schema")

const articlesRouter = express.Router()

articlesRouter.post("/", async(req,res,next)=>{
    try {
        const newArticle = new ArticleSchema(req.body)
        const { _id} = await newArticle.save()
        res.status(201).send(_id)        
    } catch (error) {
        next(error)
    }
})

articlesRouter.get("/",async(req,res,next)=>{
    try {
        const articles = await ArticleSchema.find()
        res.send(articles)
    } catch (error) {
        next(error)
    }
})

articlesRouter.get("/:id",async(req,res,next)=>{
    try {
        const id =- req.params.id
        const article = await ArticleSchema.findById(id)
        if(article){
            res.send(article)
        }else{
            const errors = new Error()
            errors.httpStatusCode = 404
            next(errors)
        }
    } catch (error) {
       next(error) 
    }
})
articlesRouter.put("/:id",async(req,res,next)=>{
    try {
        const id = req.params.id
        const article = await ArticleSchema.findByIdAndUpdate(id,req.body,{
            runValidators: true,
            new: true, 
        })
        if(article){
            res.status(201).send(article)
        }else{
            const errors = new Error()
            errors.httpStatusCode = 404
            next(errors)
        }
    } catch (error) {
        next(error)
    }
})
articlesRouter.delete("/:id",async(req,res,next)=>{
    try {
        const id = req.params.id
        const article = await ArticleSchema.findByIdAndDelete(id)
        if(article){
            res.send("deleted")
        }else{
            const erros = new Error()
            errors.httpStatusCode= 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
})

module.exports = articlesRouter