import Routes from './routes.js';
import { _REQ, Request } from './request.js';
import { _RES, Response } from './response.js';
import http, { RequestListener } from 'node:http';
import { THTTPRequestMethods } from '../types/types.js';

export default class Jevel {
  private routes: Routes
  requestListener: RequestListener<typeof _REQ, typeof _RES> = (req: _REQ, res: _RES) => { }

  constructor() {
    this.routes = new Routes()
    this.requestListener = (req: _REQ, res: _RES) => {
      const found = this.routes.search(req) || null

      if (found) {
        if (req.method === 'POST') {

          let body = ''

          req.on('data', (chunk) => {
            body += chunk
          })

          req.on('end', () => {
            req.wrapper.body = JSON.parse(body)
            return found(req.wrapper, res.wrapper)
          })
        } else {
          return found(req.wrapper, res.wrapper)
        }
      } else {
        res.writeHead(404, 'Not Found')
        res.write(`Request [${req.method as string}] Not Found | ${req.url as string}`)
        res.end()
      }
    }
  }

  route(method: THTTPRequestMethods, path: string, func: (req: Request, res: Response) => void) {
    this.routes.init(method, path, func)
  }

  start(port: number, options: any) {
    const server = http.createServer(options, this.requestListener)
    server.listen(port, () => { console.log("[Server Started]") })
  }
}
