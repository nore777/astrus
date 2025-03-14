import Astrus from "./class/astrus.js";
import { _REQ, Request } from "./class/request.js";
import { _RES, Response } from "./class/response.js";
import { THTTPRequestMethods } from "./types/types.js";
import IRoute from "./types/IRoute.js";

const route = (method: THTTPRequestMethods, path: string, func: (req: Request, res: Response) => void) => {
  const route: IRoute = { method, path, func }
  return route
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

