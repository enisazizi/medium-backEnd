const express = require("express")
const cors = require("cors")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")
const passport = require("passport")
const cookieParser = require("cookie-parser")
const articlesRouter = require("./services/articles")
const authorRouter = require("./services/authors")


const oauth = require("./services/auth/oauth")

const {
    notFoundErrorHandler,
    unauthorizedErrorHandler,
    forbiddenErrorHandler,
    badRequestErrorHandler,
    catchAllErrorHandler,
  } = require("./errorHandlers")

const server = express()
const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
const port = process.env.PORT
server.use(cors(corsOptions))
server.use(express.json())
server.use(cookieParser())
server.use(passport.initialize())

server.use("/articles",articlesRouter)
server.use("/authors",authorRouter)


server.use(notFoundErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(forbiddenErrorHandler)
server.use(badRequestErrorHandler)
server.use(catchAllErrorHandler)

console.log(listEndpoints(server))

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch(err => console.log(err))