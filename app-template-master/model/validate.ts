import Ajv from "ajv/dist/2020"
import addFormats from "ajv-formats"
import addKeywords from "ajv-keywords"
import { addFormatsAccess } from "./access"

/**
 * Ajv validation object
 *
 * va.
 **/
const validators:Record<string,Ajv> = {}

export const create = (v: string) => {
  if (!validators[v]) {
    const val = (validators[v] = new Ajv({useDefaults: true, strict:false}))
    addKeywords(val)
    addFormats(val)
    addFormatsAccess(val)
  }
  return validators[v]
}

create("default")

export default validators
