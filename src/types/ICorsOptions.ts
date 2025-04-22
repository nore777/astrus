import { THTTPRequestMethods } from "./types.js";
import { IncomingHttpHeaders } from "http";
import { CapitalizeHeader } from "./types.js";


export default interface ICorsOptions {
  origin?: string[] | string,
  methods?: THTTPRequestMethods[],
  allowedHeaders?: { [key in keyof IncomingHttpHeaders as CapitalizeHeader<key & string>]: string } | null,
  exposedHeaders?: { [key in keyof IncomingHttpHeaders as CapitalizeHeader<key & string>]: string } | null,
  credentials?: boolean,
  optionsSuccessStatus?: number,
  maxAge?: number,
}
