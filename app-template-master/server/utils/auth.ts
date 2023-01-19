import { login_schema, register_schema } from "@server/types/auth.schema"
import JwtClaims from "@server/types/jwt.schema"
import { n_array } from "@server/utils"
import { validate } from "@server/utils.yup"
import crypto from "crypto"
import fs from "fs"
import { jwt as jsonwebtoken } from "jsonwebtoken"
import { difference, pick } from "lodash"
import { resolve } from "path"
import { RequestHandler } from "webpack-dev-server"
import db from "./db"
import { wA, wE } from "./swagger"

const pass = (pass: string, salt: Buffer) => {
  return crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha512`)
}
const pass_is_valid = (
  _pass?: Buffer | null,
  _salt?: Buffer | null,
  __pass?: string
) => {
  return !(_pass
    ? !__pass || (_salt && pass(__pass, _salt).compare(_pass) !== 0)
    : false)
}

/**
 * ! Note: On production secret contains Date.now()
 * ! which means if app restarts, users will have to relogin
 */
const secret_file = resolve(__dirname, "secret.txt")
const secret =
  (fs.existsSync(secret_file) && fs.readFileSync(secret_file)) ||
  "hmEGEwiaeVDZZnDgTK3G" + (process.env.APP_DEBUG__S ? "" : Date.now())

const auth_endpoints = wE((w) => {
  w("post", {
    input: `user: string
  pass: string (the new password)
  code|prev: string (email code or previous password)`,
  })(
    "/reset",
    wA(async (req, res) => {
      const b = validate(register_schema, req.body)
      if (!b) throw "\\input"
      if (!b.user || !b.pass) throw "\\input"

      const user = await db.user.findFirst({
        where: { user: b.user, enabled: true },
      })
      if (!user) throw "User not found"
      if (!user.salt) user.salt = crypto.randomBytes(16)

      // Check password
      if (!pass_is_valid(user.pass, user.salt, b.prev)) throw 401
      // Set new pass
      user.pass = pass(b.pass, user.salt)
      // Update DB User
      await db.user.update({ where: { id: user.id }, data: user })

      res.sendStatus(200)
    })
  )

  w("post", { input: login_schema.describe().fields })(
    "/login",
    wA(async (req, res) => {
      const b = validate(login_schema, req.body)
      if (!b || !b.user) throw "\\input"

      const user = await db.user.findFirst({ where: { user: b.user } })
      if (!user) throw "User not found"
      const payload: JwtClaims = pick(user, "user", "id")
      const token = jsonwebtoken.sign(payload, secret, {
        expiresIn: process.env.SERVER_JWT_EXPIRATION__S || "1d",
      })

      // Check password
      if (!pass_is_valid(user.pass, user.salt, b.pass)) throw 401

      if (!user.pass)
        console.log(`WARNING: No user pass, logging in 'user:${user.user}'`)

      res.send(token)
    })
  )
})

/**
 * Makes sure there's a valid token in the request
 */
export const authorize = (): RequestHandler => (req, res, next) => {
  // Extract token from header
  const token = req.headers.authorization?.match(
    /^bearer ([\w\-]+\.[\w\-]+\.[\w\-]+)/i
  )?.[1]
  if (!token) throw "Not valid 'authorization' header"

  // Verify token validity with secret
  jsonwebtoken.verify(token, secret)
  // Parse the token body
  const _jwt = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  ) as JwtClaims
  // Save in response locals for later retrival
  res.locals.jwt = _jwt

  next()
}

/**
 * Get jwt token from `res.locals`
 * NOTE: has to be placed after an authorize endpoint */
export const jwt = (res) => {
  if (!res.locals.jwt) throw `Calling jwt() before an authorize() middleware`
  return res.locals.jwt as JwtClaims
}

type AuthOption = {
  claims?: string | string[]
} & Pick<JwtClaims, "roles" | "groups">

/**
 * Asserts jwt has certain ncessary values
 */
export const jwt_assert = (options?: AuthOption) => (req, res, next) => {
  const _jwt = jwt(res)
  if (
    !Object.entries(pick(options, ["roles", "groups", "claims"])).every(
      ([k, v]) => {
        difference(n_array(v, true), n_array(_jwt[k], true)).length === 0
      }
    )
  )
    throw new Error(
      `JWT Assertion Failed with options: ${JSON.stringify(
        options
      )}\njwt: ${JSON.stringify(_jwt)}`
    )
  next()
}

export default auth_endpoints
