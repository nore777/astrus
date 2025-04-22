import parseBody from "./parseBody.js"
import { THTTPRequestMethods } from "../types/types.js"
import { _REQ } from "../class/request.js"
import { _RES } from "../class/response.js"

const continueToRoute: { [key in THTTPRequestMethods]: (route: Function, req: _REQ, res: _RES) => void | boolean } = {
  'GET': (route, req, res) => {
    route(req.wrapper, res.wrapper)
  },
  'HEAD': (route, req, res) => {
    route(req.wrapper, res.wrapper)
  },
  'POST': (route, req, res) => {
    parseBody(route, req, res)
  },
  'PUT': (route, req, res) => {
    parseBody(route, req, res)
  },
  'DELETE': (route, req, res) => {
    parseBody(route, req, res)
  },
  'CONNECT': (route, req, res) => {
    // NOTE: It's probably best to ignore connect requests since it should be handled
    // by reverse proxies or similar
    route(route, req, res)
  },
  'OPTIONS': (route, req, res) => {
    parseBody(route, req, res)
  },
  'TRACE': (route, req, res) => {
    // NOTE: This isn't necessary since it's used for debugging, when 
    // developing a server in a low level language
    parseBody(route, req, res)
  },
  'PATCH': (route, req, res) => {
    parseBody(route, req, res)
  },
}

export default continueToRoute
