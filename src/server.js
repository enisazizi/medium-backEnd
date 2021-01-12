const express = require("express")
const cors = require("cors")
const {join} = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")

const articlesRouter = require("./services/articles")

const {
    notFoundErrorHandler,
    unauthorizedErrorHandler,
    forbiddenErrorHandler,
    badRequestErrorHandler,
    catchAllErrorHandler,
  } = require("./errorHandlers")

const server = express()

const port = process.env.PORT

server.use(express.json())
server.use(cors())

server.use("/articles",articlesRouter)

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