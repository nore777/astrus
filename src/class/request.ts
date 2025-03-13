import { IncomingMessage } from 'http'
import { Socket } from 'net'


export class Request {
  request: _REQ
  segments: { [key: string]: string }
  body: Object | string

  constructor(request: _REQ) {
    this.request = request
    this.segments = {}
    this.body = {}
  }
}

export class _REQ extends IncomingMessage {
  constructor(socket: Socket) {
    super(socket)
    this.wrapper = new Request(this)
  }
  wrapper: Request
}
