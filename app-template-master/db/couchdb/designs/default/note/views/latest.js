function map(d) {
  if (d.type === "note") {
    emit(d.updated, null)
  }
}

module.exports = { map }
