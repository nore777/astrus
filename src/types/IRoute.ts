import { THTTPRequestMethods } from "./types.js"
import { Request } from "../class/request.js"
import { Response } from "../class/response.js"

export default interface IRoute {
  method: THTTPRequestMethods,
  path: string,
  func: (req: Request, res: Response) => void
}
