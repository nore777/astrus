import Astrus from "./class/astrus.js";
import { _REQ, Request } from "./class/request.js";
import { _RES, Response } from "./class/response.js";
import { THTTPRequestMethods, TMiddlewares, TRouteHandler } from "./types/types.js";
import IRoute from "./types/IRoute.js";


function route(method: THTTPRequestMethods, path: string, func: TRouteHandler): IRoute
function route(method: THTTPRequestMethods, path: string, middlewares: TMiddlewares, func: TRouteHandler): IRoute
function route(
  method: THTTPRequestMethods,
  path: string,
  funcOrMiddleware: TRouteHandler | TMiddlewares,
  func?: TRouteHandler
) {

  if (Array.isArray(funcOrMiddleware)) {
    const route: IRoute = {
      method: method,
      path: path,
      middlewares: funcOrMiddleware as TMiddlewares,
      func: func!
    }
    return route
  } else {
    const route: IRoute = {
      method: method,
      path: path,
      func: funcOrMiddleware as TRouteHandler
    }
    return route
  }
}



const controller = (func: (req: Request, res: Response) => void) => {
  return func
};

export default Astrus
export {
  route,
  controller,
  Request,
  Response,
};

