import { IncomingMessage } from 'http'
import { Socket } from 'net'


export class Request {
  constructor(request: _REQ) {
    this.request = request
  }

  request: _REQ
  segments: { [key: string]: string }
}

export class _REQ extends IncomingMessage {
  constructor(socket: Socket) {
    super(socket)
    this.wrapper = new Request(this)
  }
  wrapper: Request
}
