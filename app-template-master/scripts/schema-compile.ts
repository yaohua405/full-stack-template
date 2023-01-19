import { schemas } from "../model"
import { compile } from "json-schema-to-typescript"
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs"
import { parse, resolve } from "path"

const base = resolve(__dirname, `../model_dist`)
if(existsSync(base))rmSync(base, { recursive: true });
Object.entries(schemas).forEach(([ks, vs]) => {
  let json_dir = resolve(base, `json/${ks}`)
  mkdirSync(json_dir, { recursive: true })
  Object.entries(vs).forEach(([k, v]) => {
    writeFileSync(resolve(json_dir, `${k}`), JSON.stringify(v, undefined, 2))
  })
  const ts_dir = resolve(base, `ts/${ks}`)
  mkdirSync(ts_dir, { recursive: true })
  Object.entries(vs).forEach(([k, v]) => {
    compile(v as any, k, { cwd: json_dir }).then((ts) => {
      // console.log(`./model_dist/${ks}/${vs}.d.ts\n`, ts)
      const fname = resolve(ts_dir, `${k}.d.ts`)
      writeFileSync(fname, ts)
      // console.log(fname, ts)
    })
  })
})
