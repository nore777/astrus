import { IncomingMessage } from 'http'
import { _RES } from './response.js'
import { Socket } from 'net'


export class Request {
  _: _REQ
  url: string
  segments: { [key: string]: string }
  body: Object | string

  constructor(req: _REQ) {
    this._ = req
    this.url = req.url as string
    this.segments = {}
    this.body = {}
  }
}

export class _REQ extends IncomingMessage {
  wrapper: Request

  constructor(socket: Socket) {
    super(socket)
    this.wrapper = new Request(this)
  }
}
