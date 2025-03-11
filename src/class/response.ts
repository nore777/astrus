import { IncomingMessage, ServerResponse } from "http";


export class Response {
  constructor(res: _RES) {
    this.response = res
  }
  response: _RES

  error(status: number = 500, message: string = "Internal Server Error") {
    this.response.writeHead(status)
    this.response.end(message);
  }
}


export class _RES<Request extends IncomingMessage = IncomingMessage> extends ServerResponse<Request> {
  constructor(req: Request) {
    super(req)
    this.wrapper = new Response(this)
  }
  wrapper: Response
}
