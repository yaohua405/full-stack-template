import couchdb_init from "@root/db/couchdb"
import cors from "cors"
import express from "express"
import http from "http"
import "./config"
import { graphql } from "./graphql"
import errors from "./utils/errors"
import logger from "./utils/logger"
import manage from "./utils/manage"
import startup_time from "./utils/startup_time"
import swagger from "./utils/swagger"

const webapp_path = "/" + process.env.APP_PATH__S

;(async () => {
  var db = await couchdb_init()

  var app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.text())
  app.use(cors())
  app.set("trust proxy", true)

  const w = swagger(app)

  w("use")(logger())

  w("get")("/", (req, res) => res.redirect(webapp_path))

  w(startup_time)

  w("use")(webapp_path, express.static(__dirname + webapp_path))

  w("use")("/graphql", graphql(db))

  // Manage Server
  w(manage)

  // Notes
  // ;(async () => {
  //   console.log(
  //     `Created document ${JSON.stringify(
  //       await db.insert({ name: "Ruben" }),
  //       undefined,
  //       2
  //     )}`
  //   )
  // })()

  // Default to /public folder
  w("use")(express.static(__dirname + "public"))

  // Errors
  w("use")(errors())

  // Listen
  http.createServer(app).listen(
    {
      port: Number(process.env.SERVER_HTTP_PORT),
      host: process.env.SERVER_HOSTNAME,
    },
    () => {
      console.log(
        `App listening on ${process.env.SERVER_HOSTNAME}:${process.env.SERVER_HTTP_PORT}`
      )
    }
  )
})().catch((err) => {
  throw Error(`Server startup error: ${err?.message ?? err}`)
})
