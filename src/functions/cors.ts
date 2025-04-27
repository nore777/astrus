import Astrus from "../class/astrus.js"
import { _REQ, Request } from "../class/request.js"
import { _RES, Response } from "../class/response.js"
import ICorsOptions from "../types/ICorsOptions.js"

export const corsDefaultOptions: ICorsOptions = {
  origin: null,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: null,
  exposedHeaders: null,
  credentials: false,
  optionsSuccessStatus: 204,
  maxAge: 0,
}

export function corsOptions(this: Astrus, options: ICorsOptions) {
  this.cors = {
    ...this.cors,
    ...options
  }
}

export function handleCors(this: Astrus, req: _REQ, res: _RES): boolean {
  if (!this.cors.origin) {
    return false
  }


  if (req.method === "OPTIONS") {
    // TODO:
    return true
  } else {
    if (req.headers.origin && this.cors.origin.includes(req.headers.origin)) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    return false
  }
}


// res.setHeader('Access-Control-Allow-Methods', this.cors.methods!.join(', '));
// res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
// res.setHeader('Access-Control-Allow-Credentials', 'true');
// res.setHeader('Access-Control-Max-Age', '1');
// res.setHeader('Access-Control-Allow-Origin', '*');
// return res.end();
//       } else {
//   if (req.headers.origin && this.cors.origin!.includes(req.headers.origin)) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//   }


