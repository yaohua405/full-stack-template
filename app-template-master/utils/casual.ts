import _g from "casual"

const g = _g as Casual.Generators & Casual.Casual & Casual_Custom

interface Casual_Custom {
  n: <T>(v?: T) => T | null
  u: <T>(v?: T) => T | undefined
  nu: <T>(v?: T) => T | null | undefined
  str: (s?: string) => string
}
g.define("n", (v?) => g.random_element([v, null]))
g.define("u", (v?) => g.random_element([v, undefined]))
g.define("nu", (v?) => g.random_element([v, null, undefined]))
g.define("str", (s?: string) => g.random_element([s ?? g.string, ""]))

export default g