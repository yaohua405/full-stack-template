import { IRouter, RequestHandler } from "express-serve-static-core";
import { swagger_page } from "./page";
import g from "@root/utils/casual";
import { flatMap } from "lodash";

export const ends: (Endpoint | string)[] = [];

export type Endpoint = {
  path?: string;
  method?: string;
  link?: string;
  comment?: string;
  input?;
  output?;
  hide?: boolean;
  id?: string;
  is_route?: boolean;
};

export type Method =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head"
  | "use";

export type TPE = TP | IRouter;
export type TPV = (w: TPE, options?: Endpoint) => void;
export interface TP {
  <K extends Method>(k: K, options?: Endpoint): IRouter[K];
  (k: TPV, options?: Endpoint): void;
}

/**
 * Swagger extension function, handles making sure things work regardless of wehter there's a Swagger or not being passed
 * @param e
 * @returns
 */
export const wE =
  (e: (w: TP) => void): TPV =>
  (w, options) => {
    if (options) options_base.push(options);
    e(NormalizeW(w));
    if (options) options_base.pop();
  };
/**
 * Accepts w or Express app, will output what's needed
 */
const NormalizeW = (w: TPE) => (is_router(w) ? (k) => w[k] : w);
const is_router = (x: TPE): x is IRouter => !!x["all"];

var path_base: string[] = [],
  options_base: Endpoint[] = [];

/**
 * const w = swagger(app)
 *
 * w(app.get)('/hello', (req,res)=>res.send("Hello"))
 */
const swagger = (_app: IRouter) => {
  const w: TP = (k, options) => {
    if (typeof k === "function") {
      const r = k(w, options);
      if (!!r)
        throw `You're returning a '${typeof r}'? you're really not supposed to do that you know`;
      return;
    }
    let method =
      typeof k === "string"
        ? k.toUpperCase()
        : //  k[0].toUpperCase() + k.substring(1)
          "";

    return (path: any, ...args) => {
      // Handling nested routes
      if (options?.is_route) {
        if (args.length !== 1) throw "Args isn't 1 on is_route option?";
        let router = args[0];
        if (is_router(router))
          throw "is_route is true and you passed a IRouter directly, instead of a () => IRouter";
        ends.push(
          `<div class="section radius" style="background: ${g.rgb_hex}20">`
        );
        path_base.push(path);
        router = router();
        path_base.pop();
        ends.push(`</div>`);
        if (!is_router(router))
          throw `is_route is true your function is not () => IRouter, it's returning '${router}' instead`;
        args[0] = router;
      } else if (method && method !== "use" && typeof path === "string") {
        const e: Endpoint = {
          method,
          path: path_base.join("") + path,
          ...options_base.reduce((a, v) => Object.assign(a, v), {}),
          ...options,
        };
        ends.push(e);
      }

      return (typeof k === "string" ? _app[k] : k).apply(_app, [path, ...args]);
    };
  };
  w("get", { comment: "This page", hide: true })("/swagger", swagger_page);
  return w;
};
export const wA =
  <T extends RequestHandler>(fn: T): RequestHandler =>
  (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
export default swagger;
