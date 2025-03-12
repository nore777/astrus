import Routes from './routes';
import { _REQ, Request } from './request';
import { _RES, Response } from './response';
import { RequestListener } from 'node:http';
import { THTTPRequestMethods } from '../types/types';

export class Astrus {
  private routes: Routes
  server: RequestListener<typeof _REQ, typeof _RES> = (req: _REQ, res: _RES) => { }

  constructor() {
    this.routes = new Routes()

    this.server = (req: _REQ, res: _RES) => {
      if (req !== undefined) {
        const found = this.routes.search(req) || null
        if (found) {
          return found(req.wrapper, res.wrapper)
        }
        res.writeHead(404, 'Not Found')
        res.write(`Request [${req.method as string}] Not Found | ${req.url as string}`)
        res.end()
      }
    }
  }


  route(method: THTTPRequestMethods, path: string, func: (req: Request, res: Response) => void) {
    this.routes.init(method, path, func)
  }

}
