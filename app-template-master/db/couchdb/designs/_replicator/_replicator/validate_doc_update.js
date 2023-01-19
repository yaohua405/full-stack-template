function validate_doc_update(docNew, docOld, userC) {
  function reportError(error_msg) {
    log(
      "Error writing document `" +
        docNew._id +
        "' to the replicator database: " +
        error_msg
    )
    throw { forbidden: error_msg }
  }

  function validateEndpoint(endpoint, fieldName) {
    if (
      typeof endpoint !== "string" &&
      (typeof endpoint !== "object" || endpoint === null)
    ) {
      reportError(
        "The `" +
          fieldName +
          "' property must exist" +
          " and be either a string or an object."
      )
    }

    if (typeof endpoint === "object") {
      if (typeof endpoint.url !== "string" || !endpoint.url) {
        reportError(
          "The url property must exist in the `" +
            fieldName +
            "' field and must be a non-empty string."
        )
      }

      if (
        typeof endpoint.auth !== "undefined" &&
        (typeof endpoint.auth !== "object" || endpoint.auth === null)
      ) {
        reportError("`" + fieldName + ".auth' must be a non-null object.")
      }

      if (
        typeof endpoint.headers !== "undefined" &&
        (typeof endpoint.headers !== "object" || endpoint.headers === null)
      ) {
        reportError("`" + fieldName + ".headers' must be a non-null object.")
      }
    }
  }

  var isReplicator = userC.roles.indexOf("_replicator") >= 0
  var isAdmin = userC.roles.indexOf("_admin") >= 0

  if (isReplicator) {
    // Always let replicator update the replication document
    return
  }

  if (docNew._replication_state === "failed") {
    // Skip validation in case when we update the document with the
    // failed state. In this case it might be malformed. However,
    // replicator will not pay attention to failed documents so this
    // is safe.
    return
  }

  if (!docNew._deleted) {
    validateEndpoint(docNew.source, "source")
    validateEndpoint(docNew.target, "target")

    if (
      typeof docNew.create_target !== "undefined" &&
      typeof docNew.create_target !== "boolean"
    ) {
      reportError("The `create_target' field must be a boolean.")
    }

    if (
      typeof docNew.continuous !== "undefined" &&
      typeof docNew.continuous !== "boolean"
    ) {
      reportError("The `continuous' field must be a boolean.")
    }

    if (typeof docNew.doc_ids !== "undefined" && !isArray(docNew.doc_ids)) {
      reportError("The `doc_ids' field must be an array of strings.")
    }

    if (
      typeof docNew.selector !== "undefined" &&
      typeof docNew.selector !== "object"
    ) {
      reportError("The `selector' field must be an object.")
    }

    if (
      typeof docNew.filter !== "undefined" &&
      (typeof docNew.filter !== "string" || !docNew.filter)
    ) {
      reportError("The `filter' field must be a non-empty string.")
    }

    if (
      typeof docNew.doc_ids !== "undefined" &&
      typeof docNew.selector !== "undefined"
    ) {
      reportError("`doc_ids' field is incompatible with `selector'.")
    }

    if (
      (typeof docNew.doc_ids !== "undefined" ||
        typeof docNew.selector !== "undefined") &&
      typeof docNew.filter !== "undefined"
    ) {
      reportError(
        "`filter' field is incompatible with `selector' and `doc_ids'."
      )
    }

    if (
      typeof docNew.query_params !== "undefined" &&
      (typeof docNew.query_params !== "object" || docNew.query_params === null)
    ) {
      reportError("The `query_params' field must be an object.")
    }

    if (docNew.user_ctx) {
      var user_ctx = docNew.user_ctx

      if (typeof user_ctx !== "object" || user_ctx === null) {
        reportError("The `user_ctx' property must be a " + "non-null object.")
      }

      if (
        !(
          user_ctx.name === null ||
          typeof user_ctx.name === "undefined" ||
          (typeof user_ctx.name === "string" && user_ctx.name.length > 0)
        )
      ) {
        reportError(
          "The `user_ctx.name' property must be a " +
            "non-empty string or null."
        )
      }

      if (!isAdmin && user_ctx.name !== userC.name) {
        reportError("The given `user_ctx.name' is not valid")
      }

      if (user_ctx.roles && !isArray(user_ctx.roles)) {
        reportError(
          "The `user_ctx.roles' property must be " + "an array of strings."
        )
      }

      if (!isAdmin && user_ctx.roles) {
        for (var i = 0; i < user_ctx.roles.length; i++) {
          var role = user_ctx.roles[i]

          if (typeof role !== "string" || role.length === 0) {
            reportError("Roles must be non-empty strings.")
          }
          if (userC.roles.indexOf(role) === -1) {
            reportError("Invalid role (`" + role + "') in the `user_ctx'")
          }
        }
      }
    } else {
      if (!isAdmin) {
        reportError(
          "The `user_ctx' property is missing (it is " +
            "optional for admins only)."
        )
      }
    }
  } else {
    if (!isAdmin) {
      if (!docOld.user_ctx || docOld.user_ctx.name !== userC.name) {
        reportError(
          "Replication documents can only be deleted by " +
            "admins or by the users who created them."
        )
      }
    }
  }
}

module.exports = { validate_doc_update }
