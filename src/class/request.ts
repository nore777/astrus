import { IncomingMessage } from 'http'
import { Socket } from 'net'


export class Request {
  private request: _REQ
  segments: { [key: string]: string }

  constructor(request: _REQ) {
    this.request = request
    this.segments = {}
  }

}

export class _REQ extends IncomingMessage {
  constructor(socket: Socket) {
    super(socket)
    this.wrapper = new Request(this)
  }
  wrapper: Request
}
