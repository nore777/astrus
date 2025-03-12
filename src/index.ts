import { Jevel } from "./class/jevel";
import { _REQ, Request } from "./class/request";
import { _RES, Response } from "./class/response";
import { ServerOptions } from "http";

const options: ServerOptions = {
  IncomingMessage: _REQ,
  ServerResponse: _RES,
}

export default Jevel;
export {
  options,
  Request,
  Response,
};

module.exports = Jevel;
Object.assign(module.exports, {
  options,
  Request,
  Response,
});

