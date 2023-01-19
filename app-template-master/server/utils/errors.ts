import { ErrorRequestHandler } from "express-serve-static-core";

const error_alias = {
  "\\input":
    "Input formatting received for this endpoint is wrong, check swagger.",
};

/**
 * Logs requests/responses
 */
const errors = (): ErrorRequestHandler => (err, req, res, next) => {
  switch (typeof err) {
    case "number":
      console.error(`Sending code ${err}`);
      res.sendStatus(err);
      break;
    default:
      console.error(err);
      res.status(500);
      if (typeof err === "string") {
        res.set("Content-Type", "text/plain");
        res.send(error_alias[err] ?? err);
      } else {
        res.send(err);
      }
  }
};

export default errors;
