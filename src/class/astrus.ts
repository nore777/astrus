import Routes from './routes.js';
import { _REQ, Request } from './request.js';
import { _RES, Response } from './response.js';
import http, { RequestListener } from 'node:http';
import { THTTPRequestMethods } from '../types/types.js';
import IRoute from '../types/IRoute.js';
import continueToRoute from '../utils/continueToRoute.js';
import fileToContentType from '../utils/fileToContentType.js';
import fsp from 'fs/promises'


export default class Astrus {
  private routes: Routes
  private statics = {}
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
        const fileExtention = _url.split('.')[1]
        const contentType = fileToContentType[fileExtention] || 'application/octet-stream'

        const file = await fsp.readFile(filePath)

        res.header('Content-Type', contentType)
        res.send(file)
      } catch (error) {
        res.error()
      }
    })
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

