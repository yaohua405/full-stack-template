function validate_doc_update(docNew, docOld, userC, sec) {
  const bad = (v) => {
    throw { forbidden: v ?? "Something wrong with you?" }
  }
  // What's wrong with you....
  if (userC.name === null) bad()
  // Admins can do anything
  if (userC.roles.includes("_admin")) return

  const accessRegex = require('common').regex.access

  let accNew = docNew.access,
    accOld = docOld.access

  // Disallow removal of valid access
  if (accOld && !accNew) bad("Can't remove access")
  // Stop checking if access is still disabled
  if (!accOld && !accNew) return
  // New access has to be valid
  if (accNew && !accNew.match(accessRegex))
    throw bad(`Access not valid`)
  
  accNew = accessRegex.exec(accNew).groups
  
  if (accNew.owner !== userC.name) bad("You're not the owner, go away...")
}
module.exports = { validate_doc_update }
