import { THTTPRequestMethods, TRouteHandler, TMiddlewares } from "./types.js"

export default interface IRoute {
  method: THTTPRequestMethods,
  path: string,
  middlewares?: TMiddlewares,
  func: TRouteHandler
}
