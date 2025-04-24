import { IncomingMessage, ServerResponse } from "http";


export class Response {
  _: _RES

  constructor(res: _RES) {
    this._ = res
  }

  header(name: string, value: string) {
    this._.setHeader(name, value)
  }

  send(data: string | number | Object | Buffer) {
    if (Buffer.isBuffer(data)) {
      this._.end(data)
    } else if (typeof data === 'object') {
      this._.setHeader('Content-Type', 'application/json')
      this._.write(JSON.stringify(data))
      this._.end()
    } else {
      this._.end(data)
    }
  }

  error(status: number = 500, message: string = "Internal Server Error") {
    this._.writeHead(status)
    this._.end(message);
  }
}

export class _RES<Request extends IncomingMessage = IncomingMessage> extends ServerResponse<Request> {
  constructor(req: Request) {
    super(req)
    this.wrapper = new Response(this)
  }
  wrapper: Response
}
