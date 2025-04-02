import Routes from './routes.js';
import { _REQ, Request } from './request.js';
import { _RES, Response } from './response.js';
import http, { RequestListener } from 'node:http';
import { THTTPRequestMethods, TMiddlewares, TRouteHandler } from '../types/types.js';
import IRoute from '../types/IRoute.js';
import continueToRoute from '../utils/continueToRoute.js';
import fileToContentType from '../utils/fileToContentType.js';
import fsp from 'fs/promises'
import fs from 'fs'



export default class Astrus {
  private routes: Routes
  private requestListener: RequestListener<typeof _REQ, typeof _RES> = (req: _REQ, res: _RES) => { }

  constructor() {
    this.routes = new Routes()
    this.requestListener = (req: _REQ, res: _RES) => {
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

  static(directory: string, url: string) {
    this.route('GET', url + '/*', async (req, res) => {
      try {
        const _url = req.url.substring(url.length, req.url.length)
        const filePath = directory + _url
        const fileExt = _url.split('.')[1]
        const fileSize = fs.statSync(filePath).size
        const readStream = fs.createReadStream(filePath, { highWaterMark: 16 * 1024 })
        const contentType = fileToContentType[fileExt] || 'application/octet-stream'

        res.response.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': fileSize,
        })

        readStream.on('data', async (chunk) => {
          res.response.write(chunk);
        });

        readStream.on('end', () => {
          res.response.end();
        });

        readStream.on('error', () => {
          res.response.end()
        });

      } catch (error) {
        res.error()
      }
    })
  }


  route(
    method: THTTPRequestMethods,
    path: string,
    func: TRouteHandler
  ): void;
  route(
    method: THTTPRequestMethods,
    path: string,
    middlewares: TMiddlewares,
    func: TRouteHandler
  ): void;
  route(routes: IRoute[]): void;
  route(routes: IRoute): void;
  route(
    methodRoute: THTTPRequestMethods | IRoute[] | IRoute,
    path?: string,
    funcOrMiddlewares?: TMiddlewares | TRouteHandler,
    func?: TRouteHandler,
  ) {
    if (typeof methodRoute === 'string' && path && funcOrMiddlewares) {
      if (Array.isArray(funcOrMiddlewares)) {
        this.routes.init({
          method: methodRoute,
          path,
          middlewares: funcOrMiddlewares as TMiddlewares,
          func: func as TRouteHandler
        })
      } else {
        this.routes.init({
          method: methodRoute,
          path,
          func: funcOrMiddlewares as TRouteHandler
        })
      }
    } else {
      if (Array.isArray(methodRoute)) {
        for (let i = 0; i < methodRoute.length; i++) {
          this.routes.init(methodRoute[i] as IRoute)
        }
      } else {
        this.routes.init(methodRoute as IRoute)
      }
    }
  }

  start(port: number, callback: () => void) {
    const server = http.createServer({ IncomingMessage: _REQ, ServerResponse: _RES }, this.requestListener)
    server.listen(port, callback)
  }
}

