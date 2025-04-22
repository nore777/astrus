import { Request } from "../class/request.js"
import { Response } from "../class/response.js"

export type THTTPRequestMethods =
  'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export type TMiddlewares = [(req: Request, res: Response, next: Function) => Response | Function | void]

export type TRouteHandler = (req: Request, res: Response) => void

export type TNext = () => void

type HeaderOverrideMap = {
  'www-authenticate': 'WWW-Authenticate';
};

export type CapitalizeHeader<T extends string> =
  T extends keyof HeaderOverrideMap
  ? HeaderOverrideMap[T]
  : T extends `${infer Head}-${infer Tail}`
  ? `${Capitalize<Head>}-${CapitalizeHeader<Tail>}`
  : Capitalize<T>;
