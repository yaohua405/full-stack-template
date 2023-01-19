function validate_doc_update(docNew, docOld, userC, sec) {
  if (docNew._deleted === true) {
    // allow deletes by admins and matching users
    // without checking the other fields
    if (userC.roles.indexOf("_admin") !== -1 || userC.name == docOld.name) {
      return
    } else {
      throw { forbidden: "Only admins may delete other user docs." }
    }
  }

  if (docNew.type !== "user") {
    throw { forbidden: "doc.type must be user" }
  } // we only allow user docs for now

  if (!docNew.name) {
    throw { forbidden: "doc.name is required" }
  }

  if (!docNew.roles) {
    throw { forbidden: "doc.roles must exist" }
  }

  if (!isArray(docNew.roles)) {
    throw { forbidden: "doc.roles must be an array" }
  }

  for (var idx = 0; idx < docNew.roles.length; idx++) {
    if (typeof docNew.roles[idx] !== "string") {
      throw { forbidden: "doc.roles can only contain strings" }
    }
  }

  if (docNew._id !== "org.couchdb.user:" + docNew.name) {
    throw {
      forbidden: "Doc ID must be of the form org.couchdb.user:name",
    }
  }

  if (docOld) {
    // validate all updates
    if (docOld.name !== docNew.name) {
      throw { forbidden: "Usernames can not be changed." }
    }
  }

  if (docNew.password_sha && !docNew.salt) {
    throw {
      forbidden:
        "Users with password_sha must have a salt." +
        "See /_utils/script/couch.js for example code.",
    }
  }

  var available_schemes = ["simple", "pbkdf2", "bcrypt"]
  if (
    docNew.password_scheme &&
    available_schemes.indexOf(docNew.password_scheme) == -1
  ) {
    throw {
      forbidden:
        "Password scheme `" + docNew.password_scheme + "` not supported.",
    }
  }

  if (docNew.password_scheme === "pbkdf2") {
    if (typeof docNew.iterations !== "number") {
      throw { forbidden: "iterations must be a number." }
    }
    if (typeof docNew.derived_key !== "string") {
      throw { forbidden: "derived_key must be a string." }
    }
  }

  var is_server_or_database_admin = function (userCtx, secObj) {
    // see if the user is a server admin
    if (userCtx.roles.indexOf("_admin") !== -1) {
      return true // a server admin
    }

    // see if the user a database admin specified by name
    if (secObj && secObj.admins && secObj.admins.names) {
      if (secObj.admins.names.indexOf(userCtx.name) !== -1) {
        return true // database admin
      }
    }

    // see if the user a database admin specified by role
    if (secObj && secObj.admins && secObj.admins.roles) {
      var db_roles = secObj.admins.roles
      for (var idx = 0; idx < userCtx.roles.length; idx++) {
        var user_role = userCtx.roles[idx]
        if (db_roles.indexOf(user_role) !== -1) {
          return true // role matches!
        }
      }
    }

    return false // default to no admin
  }

  if (!is_server_or_database_admin(userC, sec)) {
    if (docOld) {
      // validate non-admin updates
      if (userC.name !== docNew.name) {
        throw {
          forbidden: "You may only update your own user document.",
        }
      }
      // validate role updates
      var oldRoles = (docOld.roles || []).sort()
      var newRoles = docNew.roles.sort()

      if (oldRoles.length !== newRoles.length) {
        throw { forbidden: "Only _admin may edit roles" }
      }

      for (var i = 0; i < oldRoles.length; i++) {
        if (oldRoles[i] !== newRoles[i]) {
          throw { forbidden: "Only _admin may edit roles" }
        }
      }
    } else if (docNew.roles.length > 0) {
      throw { forbidden: "Only _admin may set roles" }
    }
  }

  // no system roles in users db
  for (var i = 0; i < docNew.roles.length; i++) {
    if (docNew.roles[i] !== "_metrics") {
      if (docNew.roles[i][0] === "_") {
        throw {
          forbidden: "No system roles (starting with underscore) in users db.",
        }
      }
    }
  }

  // no system names as names
  if (docNew.name[0] === "_") {
    throw { forbidden: "Username may not start with underscore." }
  }

  var badUserNameChars = [":"]

  for (var i = 0; i < badUserNameChars.length; i++) {
    if (docNew.name.indexOf(badUserNameChars[i]) >= 0) {
      throw {
        forbidden:
          "Character `" +
          badUserNameChars[i] +
          "` is not allowed in usernames.",
      }
    }
  }
}

module.exports = { validate_doc_update }
