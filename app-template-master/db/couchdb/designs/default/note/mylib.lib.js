const regex = {
  access: /^(?<owner>[a-z0-9_]{2,})(?: (?<rights>[0-3]{1,2})(?:;(?<users>(?::?[a-z0-9_]{2,})*)(?: (?<urights>[0-3]*))?)?)?$/
}

module.exports = {regex}