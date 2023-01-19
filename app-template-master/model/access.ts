import { JSONSchema22 } from "@root/types/json-schema"


const access_regex =
  /^(?<owner>[a-z0-9_]{2,})(?: (?<rights>[0-3]{1,2})(?:;(?<users>(?::?[a-z0-9_]{2,})*)(?: (?<urights>[0-3]*))?)?)?$/
export const addFormatsAccess = (v) => {
  /**
   * user regex -> [a-z0-9_]{2,}
   */
  v.addFormat("user", /^[a-z0-9_]{2,}$/)
  /**
   * How best to store resource access
   * We could try:
   * 	A one-many relationship defining access similar to linux permissions
   *  A user is [a-z0-9_]{2,}
   * 	A permission is [0-3] for read/write bits
   *
   *  The rule is 'owner 33;user:user 33' and can be stacked as follows
   * 		ex: 'rub', 'rub:rub_dad 43'
   *
   * 	If there's more users than permissionbytes (either last byte, or other byte [if present]) will be used for that user
   * 		ex: 'rub:john:clark 3'
   * 	There can be an extra last byte for all other users defined by ';0' at the end
   * */
  v.addFormat("access", access_regex)
  return v
}

export const access: JSONSchema22 = {
  title: "Access string",
  description: `Describes access to this resource from a user:
   '#' means 0-3 char, a 2bit number, where 1st bit is read, 2nd write
   'O' and 'U' mean # as Other or User access respectively

  Owner has read/write access
  'owner'
  Owner has read/write, others have O access
  'owner O'
  Owner has read/write, others have O access
  'owner OU'
  Owner has read/write, others have O access, user has U access
  'owner OU;user'
  Owner has read/write, others have O access, first 'user' has # access, rest have U access
  'owner OU;user:user:user #'
  Owner has read/write, others have O access, user:user have ## access respectively
  'owner OU;user:user ##'`,
  examples: [
    "rubend",
    "rubend 3",
    "rubend 10",
    "rubend 13;leo",
    "rubend 13;leo:nina:john 1",
    "rubend 13;leo:nina 12",
  ],
  type: "string",
  format: "access",
}


export const hasAccess = (user: string, access?: string) => {
  if (typeof access === "undefined") return { read: true, write: true }

  const match = access_regex.exec(access)?.groups as Record<
    "owner" | "rights" | "users" | "urights",
    string
  >
  if (!match) throw "something wrong..."

  let right
  if (user === match.owner) {
    right = "3"
  } else {
    const i = (match.users ?? []).indexOf(user)
    right =
      // Either take found index/users right, or as last resort other/0 right
      // But make sure if user isn't found, you'll take the other/0 right
      (i !== -1 ? match.urights?.[i] ?? match.rights?.[1] : undefined) ??
      match.rights?.[0] ??
      "0"
  }
  const right_n = Number(right)

  return {
    read: Boolean(right_n & (1 << 0)),
    write: Boolean(right_n & (1 << 1)),
  }
}
