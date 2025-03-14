import Routes from './routes.js';
import { _REQ, Request } from './request.js';
import { _RES, Response } from './response.js';
import http, { RequestListener } from 'node:http';
import { THTTPRequestMethods } from '../types/types.js';
import IRoute from '../types/IRoute.js';


const parseBody = (route: Function, req: _REQ, res: _RES): void => {
  let body = ''

  req.on('data', (chunk: any) => {
    body += chunk
  });

  req.on('end', () => {
    try {
      if (req.headers['content-type'] === 'application/json') {
        req.wrapper.body = JSON.parse(body)
      } else {
        req.wrapper.body = body
      }
      route(req.wrapper, res.wrapper)
    } catch (error) {
      res.wrapper.error(400, "Bad Request")
    }
  })
}

const continueToRoute: { [key in any]: (route: Function, req: _REQ, res: _RES) => void | boolean } = {
  'GET': (route, req, res) => {
    route(req.wrapper, res.wrapper)
  },
  'POST': (route, req, res) => {
    parseBody(route, req, res)
  }
}

export default class Jevel {
  private routes: Routes
  private requestListener: RequestListener<typeof _REQ, typeof _RES> = (req: _REQ, res: _RES) => { }

  constructor() {
    this.routes = new Routes()
    this.requestListener = (req: _REQ, res: _RES) => {
      const found = this.routes.search(req) || null
      if (found) {
        try {
          continueToRoute[req.method as THTTPRequestMethods](found, req, res)
        } catch (error) {
          console.log(error)
          res.write('Not allowed')
          res.end()
        }
      } else {
        res.writeHead(404, 'Not Found')
        res.write(`Request [${req.method as string}] Not Found | ${req.url as string}`)
        res.end()
      }
    }
  }

  route(method: THTTPRequestMethods, path: string, func: (req: Request, res: Response) => void): void;
  route(routes: IRoute[]): void;
  route(routes: IRoute): void;
  route(
    methodRoute: THTTPRequestMethods | IRoute[] | IRoute,
    path?: string,
    func?: (req: Request, res: Response) => void,
  ) {
    if (typeof methodRoute === 'string' && path && func) {
      this.routes.init({ method: methodRoute, path, func })
    } else {
      if (Array.isArray(methodRoute)) {
        console.log("Initializing array of routes")
        for (let i = 0; i < methodRoute.length; i++) {
          this.routes.init(methodRoute[i] as IRoute)
        }
      } else {
        console.log(methodRoute, "Initializing single route")
        this.routes.init(methodRoute as IRoute)
      }
    }
  }

  start(port: number) {
    const server = http.createServer({ IncomingMessage: _REQ, ServerResponse: _RES }, this.requestListener)
    server.listen(port, () => { console.log('[Server Started]') })
  }
}
