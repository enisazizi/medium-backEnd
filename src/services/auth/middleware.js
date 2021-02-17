const jwt = require("jsonwebtoken")
const AuthorModel = require("../authors/schema")
const { verifyJWT } = require("./tools")

const authorize = async(req,res,next)=>{
    try { 
        const token = req.header("Authorization").replace("Bearer ","")
        const decoded = await verifyJWT(token)
        const author = await AuthorModel.findOne({
            _id:decoded._id
        })

        if(author){
            req.token = token 
            req.author = author
            next()
        }else{
            throw new Error("middleware error")
        }
        
    } catch (error) {
        const err = new Error("please authenticate")
        err.httpStatusCode = 401 
        next(err)
    }
}

module.exports = {authorize}