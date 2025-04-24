import Routes from './routes.js';
import { _REQ, Request } from './request.js';
import { _RES, Response } from './response.js';
import http, { RequestListener } from 'node:http';
import { THTTPRequestMethods } from '../types/types.js';
import continueToRoute from '../utils/continueToRoute.js';
import ICorsOptions from '../types/ICorsOptions.js';

import route from '../functions/route.js';
import serveStatic from '../functions/serveStatic.js';
import { corsDefaultOptions, corsOptions } from '../functions/cors.js';

export default class Astrus {
  route: typeof route
  corsOptions: typeof corsOptions
  serveStatic: typeof serveStatic
  protected routes: Routes
  protected cors: ICorsOptions
  private requestListener: RequestListener<typeof _REQ, typeof _RES> = (_req: _REQ, _res: _RES) => { }

  constructor() {
    this.routes = new Routes()
    this.route = route.bind(this)
    this.cors = corsDefaultOptions
    this.corsOptions = corsOptions.bind(this)
    this.serveStatic = serveStatic.bind(this)

    this.requestListener = (req: _REQ, res: _RES) => {

      // cors placeholder
      if (req.method === 'OPTIONS' && this.cors) {
        res.setHeader('Access-Control-Allow-Methods', this.cors.methods!.join(', '));
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '1');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.end();
      } else {
        if (req.headers.origin && this.cors.origin!.includes(req.headers.origin)) {
          res.setHeader('Access-Control-Allow-Origin', '*');
        }
      }

      const found = this.routes.search(req) || null

      if (found) {
        try {
          if (found.middlewares) {
            for (let middleware of found.middlewares) {
              if (!res.writableEnded) {
                middleware(req.wrapper as Request, res.wrapper as Response, () => { })
              } else break
            }
          }

          if (!res.writableEnded) {
            continueToRoute[req.method as THTTPRequestMethods](found.func, req, res)
          }

        } catch (error) {
          res.write(error)
          res.end()
        }
      } else {
        res.writeHead(404, 'Not Found')
        res.write(`Request [${req.method as string}] Not Found | ${req.url as string}`)
        res.end()
      }
    }
  }

  start(port: number, callback: () => void) {
    const server = http.createServer({ IncomingMessage: _REQ, ServerResponse: _RES }, this.requestListener)
    server.listen(port, callback)
  }
}

