import db_init, { DBScope } from "@root/db/couchdb"
import va from "@root/model"
import { Note } from "@root/model_dist/ts/default/doc"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"
import { mapKeys, uniqBy } from "lodash"
import schema_string from "./schema.gql"

// Construct a schema, using GraphQL schema language
export var schema = buildSchema(schema_string)

const user = "rubend"

// The rootValue provides a resolver function for each API endpoint
export var rootValue = (db: DBScope) => {
  return {
    notes: async () => {
      const can_see = uniqBy(
        (
          await Promise.all(
            [
              { startkey: `1`, endkey: `3` },
              { startkey: `1:${user}`, endkey: `3:${user}` },
            ].map((p) =>
              db.view("note", "access", { ...p, include_docs: true })
            )
          )
        )
          .map((r) => r.rows)
          .flat()
          .map((r) => r.doc),
        "_id"
      )

      return (can_see as Note[]).sort(
        (a, b) => (b?.updated ?? 0) - (a?.updated ?? 0)
      )
    },
    note: async ({ _id }) => {
      return await db.get(_id)
    },

    notePut: async (v) => {
      v = { access: `${user}`, ...v, updated: Date.now() }
      if (!va.default.note(v)) throw `Validation failed!`
      const put = await db.insert(v as any)
      if (!put.ok) throw `Couldn't put document?`
      return {
        ...(v as any),
        _id: put.id,
        _rev: put.rev,
      }
    },
    noteDelete: async ({ _id, _rev }) => {
      return await db.destroy(_id, _rev)
    },

    user: async () => {
      return await db.get(`user:${user}`)
    },
    log: async (v) => {
      if (!va.default.note(v)) throw `Validation failed!`
      await db.insert(v as any)
      return "Ok"
    },
  }
}

const plugin = (db: DBScope) =>
  graphqlHTTP({
    schema,
    rootValue: rootValue(db),
    graphiql: true,
  })
export { plugin as graphql }
