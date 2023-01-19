//@ts-linter-disable
/**
 * Loads designs at compile time
 *
 */
import { designer } from "./designer/src/index"
import { resolve } from "path"
import { readdir } from "fs/promises"

const designs_dir = resolve(__dirname, "./designs")

function loader() {
  const callback = this.async()
  ;(async () => {
    const design_names = await readdir(designs_dir, { withFileTypes: true })
    const designs = {}
    for (const dname of design_names) {
      if (
        !dname.isDirectory() ||
        // ["_replicator"].includes(dname.name)
        false
      )
        continue
      designs[dname.name] = await designer(resolve(designs_dir, dname.name))
    }
    return designs
  })()
    .then((v) => callback(null, v))
    .catch((v) => callback(Error(v)))
}

// const designDocs = {
//   note: {
//     views: {
//       access:
//     }
//   }
// }
// const designDocs_mapped = Object.entries(designDocs).map(([k,v]) => ({_id:`_design/${k}`, ...v}))

// export const design2 = designDocs_mapped

export default loader
