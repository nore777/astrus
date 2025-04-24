import { THTTPRequestMethods, TRouteHandler, TMiddlewares } from "../types/types.js";
import IRoute from "../types/IRoute.js";
import Astrus from "../class/astrus.js";


function route(
  method: THTTPRequestMethods,
  path: string,
  func: TRouteHandler
): void;
function route(
  method: THTTPRequestMethods,
  path: string,
  middlewares: TMiddlewares,
  func: TRouteHandler
): void;
function route(routes: IRoute[]): void;
function route(routes: IRoute): void;
function route(
  this: Astrus,
  methodRoute: THTTPRequestMethods | IRoute[] | IRoute,
  path?: string,
  funcOrMiddlewares?: TMiddlewares | TRouteHandler,
  func?: TRouteHandler,
) {


  if (typeof methodRoute === 'string' && path && funcOrMiddlewares) {
    if (Array.isArray(funcOrMiddlewares)) {
      this.routes.init({
        method: methodRoute,
        path,
        middlewares: funcOrMiddlewares as TMiddlewares,
        func: func as TRouteHandler
      })
    } else {
      this.routes.init({
        method: methodRoute,
        path,
        func: funcOrMiddlewares as TRouteHandler
      })
    }
  } else {
    if (Array.isArray(methodRoute)) {
      for (let i = 0; i < methodRoute.length; i++) {
        this.routes.init(methodRoute[i] as IRoute)
      }
    } else {
      this.routes.init(methodRoute as IRoute)
    }
  }
}

export default route
