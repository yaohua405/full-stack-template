/**
 * These files describe model defitions in our App.
 *
 * Reference: https://json-schema.org/
 */

import { JSONSchema22 } from "@root/types/json-schema"
import { cloneDeep, filter, mapValues } from "lodash"
import { access } from "./access"

const schemas = (name: string) => {
  // Only defined in the DB schema
  const is_d = name === "default"
  const only_d = (v, o: any = false) => (is_d ? v : o)
  // Only defined in the Client schema
  // const only_client = (v, o: any = false) => (name === "client" ? v : o)
  const doc_names = [...only_d(["action"], []), "note", "user"]

  const on_default = {
    // anonymous: {
    //   title: "Tracks anonymous users and their ips",
    //   type: 'object',
    //   properties: {
    //     u_id,
    //     ips: {type:'array', items: {type: 'string', format: 'ipv4'}}
    //   },
    //   required: ['u_id', 'ips']
    // } as JSONSchema22,
    action_type: {
      title: "Action Type",
      enum: ["opened", "closed", "selected"],
    } as JSONSchema22,
    action: {
      title: "Action",
      description:
        "Every action on webserver, should record every users's action in the application",
      type: "object",
      properties: {
        a: { $ref: "action_type#" },
        t: { type: "number" },
        ip: { type: "number" },
      },
      required: ["a", "t"],
    } as JSONSchema22,
    access,
  } as const
  // Remove all of on_default keys if it's not default
  if (!is_d) {
    Object.keys(on_default).forEach((k) => delete on_default[k])
  }

  // const access
  let s = {
    ...on_default,

    doc: {
      type: "object",
      title: "DBDoc",
      oneOf: doc_names.map((v) => ({ $ref: `${v}#` } as JSONSchema22)),
      required: ["type"],
    } as JSONSchema22,

    note: {
      title: "Note",
      description: "Describes a note",
      type: "object",
      properties: {
        // type: {const: "note"},
        title: { type: "string" },
        value: { type: "string", description: "The note's content" },
        access: only_d({ $ref: "access#" }, undefined),
        updated: { type: "integer" },
      },
      required: ["value"],
    } as JSONSchema22,
    user: {
      title: "User",
      description: "Describes a user",
      type: "object",
      properties: {
        // type: {const: "user"},
        ...only_d({
          user: {
            title: "Username",
            type: "string",
            format: "user",
          },
          pass: {
            title: "Password",
            description: "Hashed user's password",
            type: "string",
            contentEncoding: "base64",
          },
          salt: {
            title: "Salt",
            type: "string",
            contentEncoding: "base64",
            description:
              "A salt value secures the password against attacks on the DB",
          },
          enabled: {
            title: "Enabled",
            description: "Is this user allowed to log-in?",
            type: "boolean",
            default: false,
          },
        }),
        name: {
          title: "Name",
          description: "First M Last",
          type: "string",
        },
        photo: {
          title: "Photo",
          description: "User's Photo",
          type: "string",
          contentEncoding: "base64",
          contentMediaType: "image",
        },
      },
    } as JSONSchema22,
  } as const
  // Make a deep clone in case things get weird
  // s = cloneDeep(s)
  if (!doc_names.every((k) => Object.keys(s).includes(k)))
    throw `DocNames ${doc_names} has something not in the schema?`
  s = mapValues(s, (v, k) => {
    if (typeof v !== "object") return v
    // Set id if unset
    v.$id ??= `/model/${name}/${k}`
    if (v.type !== "object" && doc_names.includes(k))
      throw `Document ${k} is a doc, so it must be type: 'object', but instead it's type '${v.type}`
    if (v.type !== "object") return v
    // Set type if it's a document in our DB
    if (doc_names.includes(k)) {
      if (v.properties) {
        if (is_d) {
          v.properties.type ??= { const: k, default: k }
        }
        v.properties._id ??= { type: "string" }
        v.properties._rev ??= { type: "string" }
      }
      // Lock document for clients
      v.additionalProperties ??= false
    }
    return v
  })
  // Remove any false values
  s = Object.fromEntries(
    Object.entries(s).filter(([k, v]) => Boolean(v))
  ) as any
  return s
}

export default schemas
