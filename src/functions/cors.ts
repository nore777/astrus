import Astrus from "../class/astrus.js"
import ICorsOptions from "../types/ICorsOptions.js"

export const corsDefaultOptions: ICorsOptions = {
  origin: null,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: null,
  exposedHeaders: null,
  credentials: false,
  optionsSuccessStatus: 204,
  maxAge: 0,
}

export function corsOptions(this: Astrus, options: ICorsOptions) {
  this.cors = {
    ...this.cors,
    ...options
  }
}

export function handleCors(this: Astrus) {

}
