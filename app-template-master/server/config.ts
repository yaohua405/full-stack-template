/**
 * This is the server config, gets executed at runtime to set env defaults
 */
// import dotenv from "dotenv"

// Load .env config
// dotenv.config({ path: "./.env" })

const defaults = {
  SERVER_HTTP_PORT: Number(process.env.SERVER_HTTP_PORT__S) || 9080,
  SERVER_HOSTNAME: process.env.SERVER_HOSTNAME__S || "localhost",

  DB_USER: process.env.DB_USER__S,
  DB_PASS: process.env.DB_PASS__S,
  DB_NAME: process.env.DB_NAME__S,
  DB_HOST: process.env.DB_HOST__S,
  DB_URL: process.env.DB_URL__S,
}

// Snippet from dotenv main.js file, will set keys in env that aren't already defined
Object.keys(defaults).forEach(function (key) {
  const has_property = Object.prototype.hasOwnProperty.call(process.env, key)

  if (!has_property) {
    process.env[key] = defaults[key]
  }
  console.log(
    `${key}:"${process.env[key]}" '${has_property ? "was defined" : "was set"}'`
  )
})
