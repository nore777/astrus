import { THTTPRequestMethods } from "./types.js";

export default interface ICorsOptions {
  origin: string[] | string,
  methods: THTTPRequestMethods[],
  allowedHeaders: { [key: string]: string } | null,
  exposedHeaders: { [key: string]: string } | null,
  credentials: boolean,
  optionsSuccessStatus: 204,
  maxAge: number,
}
