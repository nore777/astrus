import { IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";

export class Request extends IncomingMessage {
  constructor(socket: Socket) {
    super(socket)
  }

  segments: { [key: string]: string }
}

export class Response<Request extends IncomingMessage = IncomingMessage> extends ServerResponse<Request> {
  constructor(req: Request) {
    super(req)
  }

  serverError(message: string = "Internal Server Error") {
    this.writeHead(500)
    this.end(message);
  }
}
