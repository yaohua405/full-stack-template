import loader from "./db/couchdb/couchjs-design"
import { minify } from "terser"
import { readdir } from "fs/promises"

// const j = {
//   async: () => (...v) => {
//     console.log(...v.map(o=>JSON.stringify(o, undefined, 2)))
//     // const source = minify({ 'file.js': v[1] }, { module: false }).then(console.log)
//   }
// }
// const result = loader.apply(j)

// console.log("Result: ", result)
import { resolve } from "path"
;(async () => {
  const dir = resolve(__dirname)
  const files = await readdir(dir, { withFileTypes: true })
  console.log("for dir: ", dir)
  console.log(
    files
      .sort((a, b) => (b.isDirectory() ? 1 : 0) - (a.isDirectory() ? 1 : 0))
      .map((v) => `${v.isDirectory() ? "Dir: " : "Fil: "} ${v.name}`)
  )
})()
