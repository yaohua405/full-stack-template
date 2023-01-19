import addFormats from "ajv-formats"
import addKeywords from "ajv-keywords"
import Ajv, { SomeJTDSchemaType } from "ajv/dist/jtd"
import { cloneDeep, mapValues } from "lodash"
import { addFormatsAccess } from "../access"
// const ajv = new Ajv()

// type SomeJTDSchemaTypeC = SomeJTDSchemaType & {}

const schema = (name: string) => {
  // Only defined in the DB schema
  const only_default = (v, o: any = undefined) => (name === "default" ? v : o)
  // Only defined in the Client schema
  const only_client = (v, o: any = undefined) => (name === "client" ? v : o)

  return cloneDeep({
    access: {
      type: "string",
      metadata: {
        format: "access",
      },
    },

    note: {
      properties: {
        value: { type: "string" },
      },
      optionalProperties: {},
    },
    user: { type: "string" },
  } as const)
}

const validators: Record<string, Ajv> = {}

export const create = (v: string) => {
  if (!validators[v]) {
    const val = (validators[v] = new Ajv())
    // addKeywords(val, ['format'])
    val.addKeyword("format")
    addFormats(val)
    addFormatsAccess(val)
  }
  return validators[v]
}

const va = mapValues({ default: false, client: true }, (is_client, name) => {
  const validator = create(name)
  const s = schema(name)

  console.log("Adding schemas for ", name)
  Object.keys(s)
    .map(
      (k) =>
        [
          {
            ref: k,
            definitions: cloneDeep(s),
          },
          k,
        ] as const
    )
    .forEach(([v, k]) => validator.addSchema(v, k))

  console.log("Compiling schemas for ", name)

  return mapValues(s, (v, k) => {
    const l = validator.getSchema(k)
    if (!l) throw `Validator undefined getting '${k}'`
    return l
  })
})

console.log(
  `Access was ${va.default.access("rubend 4") ? "Successful!" : "Failed"}`
)
