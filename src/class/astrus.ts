import Routes from './routes.js';
import { _REQ, Request } from './request.js';
import { _RES, Response } from './response.js';
import http, { RequestListener } from 'node:http';
import https from 'node:https'
import { ServerOptions as httpOptions } from 'node:http';
import { ServerOptions as httpsOptions } from 'node:https';
import { THTTPRequestMethods } from '../types/types.js';
import continueToRoute from '../utils/continueToRoute.js';
import ICorsOptions from '../types/ICorsOptions.js';
import { WithMethods } from '../types/types.js';

import route from '../functions/route.js';
import serveStatic from '../functions/serveStatic.js';
import { corsDefaultOptions, corsOptions, handleCors } from '../functions/cors.js';

export default class Astrus {
  route: typeof route
  corsOptions: typeof corsOptions
  serveStatic: typeof serveStatic
  protected handleCors: typeof handleCors
  protected routes: Routes
  protected cors: ICorsOptions
  private requestListener: RequestListener<typeof _REQ, typeof _RES> = (_req: _REQ, _res: _RES) => { }


  constructor() {
    this.routes = new Routes()
    this.route = route.bind(this)
    this.cors = corsDefaultOptions
    this.corsOptions = corsOptions.bind(this)
    this.handleCors = handleCors.bind(this)
    this.serveStatic = serveStatic.bind(this)


    this.requestListener = (req: _REQ, res: _RES) => {

      // cors
      // TODO: Create global middlewares that run on every route
      // and add cors to that instead
      if (this.handleCors(req, res)) {
        res.end()
      }

      // search for route
      const found = this.routes.search(req) || null

      if (found) {
        try {
          // middlewares
          if (found.middlewares) {
            for (let middleware of found.middlewares) {
              if (!res.writableEnded) {
                middleware(req.wrapper as Request, res.wrapper as Response, () => { })
              } else break
            }
          }
          // continue to route
          if (!res.writableEnded) {
            continueToRoute[req.method as THTTPRequestMethods](found.func, req, res)
          }
        } catch (error) {
          console.error(error)
          res.writeHead(500, 'Server Error')
          res.end()
        }
      } else {
        res.writeHead(404, 'Not Found')
        res.write(`Request [${req.method as string}] Not Found | ${req.url as string}`)
        res.end()
      }
    }
  }

  start(protocol: 'http' | 'https', port: number, options: httpOptions | httpsOptions, callback: () => void) {
    if (protocol === 'http') {
      const server = http.createServer({
        ...options,
        IncomingMessage: _REQ,
        ServerResponse: _RES,
      },
        this.requestListener
      )
      server.listen(port, callback)

    } else if (protocol === 'https') {
      const server = https.createServer({
        ...options,
        IncomingMessage: _REQ,
        ServerResponse: _RES,
      },
        this.requestListener
      )
      server.listen(port, callback)
    }
  }
}

