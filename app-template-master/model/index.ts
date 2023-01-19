import { clone, cloneDeep, mapValues } from "lodash"
import schemas from "./schema"
import { create } from "./validate"

/**  Typescript way */
const va_arr = mapValues({ default: false, client: true }, (is_client, name) => {
  const validator = create(name)
  const s = schemas(name)
	const ss = cloneDeep(s)
  
  // console.log("Adding schemas for ", name)
  validator.addSchema(Object.values(s))
  // console.log("Compiling schemas for ", name)
  return [mapValues(s, (v, k) => {
		const n = `/model/${name}/${k}`;
    const l = validator.getSchema(n)
    if (!l) throw `Validator undefined getting '${n}'`
    return l
  }), ss] as const
})

const va = mapValues(clone(va_arr), (v,k) => v[0])
const schemas_out = mapValues(clone(va_arr), (v,k) => v[1]);

export default va
export { schemas_out as schemas }
