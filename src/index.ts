import Astrus from "./class/astrus.js";
import { _REQ, Request } from "./class/request.js";
import { _RES, Response } from "./class/response.js";
import { THTTPRequestMethods } from "./types/types.js";
import IRoute from "./types/IRoute.js";

const route = (method: THTTPRequestMethods, path: string, func: (req: Request, res: Response) => void) => {
  const route: IRoute = { method, path, func }
  console.log("external route", route)
  return route
}

export default Astrus
export {
  route,
  Request,
  Response,
};


