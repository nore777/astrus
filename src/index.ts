import { Astrus } from "./class/astrus";
import { _REQ, Request } from "./class/request";
import { _RES, Response } from "./class/response";
import { ServerOptions } from "http";

const options: ServerOptions = {
  IncomingMessage: _REQ,
  ServerResponse: _RES,
}

export default Astrus;
export {
  options,
  Request,
  Response,
};

module.exports = Astrus;
Object.assign(module.exports, {
  options,
  Request,
  Response,
});

