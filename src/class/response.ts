import { IncomingMessage, ServerResponse } from "http";


export class Response {
  response: _RES

  constructor(res: _RES) {
    this.response = res
  }

  header(name: string, value: string) {
    this.response.setHeader(name, value)
  }

  send(data: string | number | Object | Buffer) {
    if (Buffer.isBuffer(data)) {
      this.response.end(data)
    } else if (typeof data === 'object') {
      this.response.setHeader('content-type', 'application/json')
      this.response.write(JSON.stringify(data))
      this.response.end()
    } else {
      this.response.end(data)
    }
  }

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
