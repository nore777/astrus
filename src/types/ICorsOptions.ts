import { THTTPRequestMethods } from "./types.js";
import { IncomingHttpHeaders } from "http";
import { CapitalizeHeader } from "./types.js";


export default interface ICorsOptions {
  origin?: string[] | null,
  methods?: THTTPRequestMethods[] | null,
  allowedHeaders?: string[] | null,
  exposedHeaders?: string[] | null,
  credentials?: boolean | null,
  optionsSuccessStatus?: number,
  maxAge?: number,
}
