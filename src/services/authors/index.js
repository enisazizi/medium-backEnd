const express = require("express")
const q2m = require("query-to-mongo")
const {authenticate,refreshToken} = require("../auth/tools")
const {authorize} = require("../auth/middleware")
const AuthorModel = require("./schema")

const authorsRouter = express.Router()


authorsRouter.get("/",authorize,async(req,res,next)=>{
    try {
       const authors = await AuthorSchema.find() 
       res.send(authors)
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/me", authorize,async(req,res,next)=>{
    try {
     
        res.send(req.author)
    } catch (error) {
        next(error)
    }
})
authorsRouter.post("/register",async(req,res,next)=>{
    try {
        const newAuthor = new AuthorModel(req.body)
        const {_id} = await newAuthor.save()

        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

authorsRouter.put("/me",async(req,res,next)=>{
    try {
        const updates = Object.keys(req.body)
        console.log(updates)
        updates.forEach(update =>(req.author[update]=req.body[update]))
        await req.author.save()
        res.send(req.author)
      
    } catch (error) {
        next(error)
    }
})
authorsRouter.delete("/me",async(req,res,next)=>{
    try {
       await req.author.deleteOne(res.send("Deleted"))
    } catch (error) {
        next(error)
    }
})

authorsRouter.post("/login",async(req,res,next)=>{
    try {
        const {username,password} = req.body 
        const author = await AuthorModel.findByCredentials(username,password)
        console.log("author",author)
        const tokens = await authenticate(author)
        res.send(tokens)
    } catch (error) {
        next(error)
    }
})


authorsRouter.post("/logout",authorize,async(req,res,next)=>{
    try {
            req.author.refreshTokens = req.author.refreshTokens.filter(
                t=>t.token !== req.body.refreshToken
            )
            await req.author.save()
            res.send("we hope you come back")
    } catch (error) {
        next(error)
    }
})
authorsRouter.post("/logoutAll", authorize, async (req, res, next) => {
    try {
      req.author.refreshTokens = []
      await req.author.save()
      res.send()
    } catch (err) {
      next(err)
    }
  })
  
  authorsRouter.post("/refreshToken", async (req, res, next) => {
    const oldRefreshToken = req.body.refreshToken
    if (!oldRefreshToken) {
      const err = new Error("Refresh token missing")
      err.httpStatusCode = 400
      next(err)
    } else {
      try {
        const newTokens = await refreshToken(oldRefreshToken)
        res.send(newTokens)
      } catch (error) {
        console.log(error)
        const err = new Error(error)
        err.httpStatusCode = 403
        next(err)
      }
    }
  })
module.exports = authorsRouter



