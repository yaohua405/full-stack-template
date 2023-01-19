/**
 * So for a query on a users visible documents we'd have
 *
 * 1
 * 1
 * 2
 * 3
 * rubend:3
 * nina:3
 *
 * to pull nina's we'd have
 */
function map(doc) {
  if (doc.type !== "note") return

  const accessRegex = require('common').regex.access

  const g = doc.access?.match(accessRegex)
    ? accessRegex.exec(doc.access).groups
    : undefined
  if (!g) return

  const t = function (...v) {
    const k = v.every(Boolean) ? v.join(":") : null
    if (k) emit(k, null)
  }
  // Owner access emit
  t("3", g.owner)
  // Other rights emit
  t(g.rights?.[0])
  // User rights emit
  g.users?.split(":").forEach((u, i) => t(g.urights?.[i] ?? g.rights?.[1], u))
}

module.exports = { map }
