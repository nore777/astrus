import Astrus from "./class/astrus.js";
import { _REQ, Request } from "./class/request.js";
import { _RES, Response } from "./class/response.js";
import { ServerOptions } from "http";

const options: ServerOptions = {
  IncomingMessage: _REQ,
  ServerResponse: _RES,
}


export default Astrus
export {
  options,
  Request,
  Response,
};


