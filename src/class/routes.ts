import { buildClientSegments, buildServerSegments } from '../utils/segments'
import { THTTPRequestMethods } from '../types/types'
import { Request, Response } from './exchange'
import { IncomingMessage, ServerResponse } from 'http'


class Node {
  dynamic: boolean | undefined
  value: string | undefined
  func: (req: Request, res: Response) => void
  children: { [key: string]: Node }
  isLeaf: boolean

  constructor() {
    this.dynamic = undefined
    this.value = undefined
    this.func = () => { }
    this.children = {}
    this.isLeaf = false
  }
}

export default class Routes {

  _init: any[]
  root: {
    GET: Node
    HEAD: Node
    POST: Node
    PUT: Node
    PATCH: Node
    DELETE: Node
  }

  constructor() {
    this._init = []
    this.root = {
      GET: new Node(),
      HEAD: new Node(),
      POST: new Node(),
      PUT: new Node(),
      PATCH: new Node(),
      DELETE: new Node()
    }
  }

  init(method: THTTPRequestMethods, path: string, func: (req: any, res: any) => void) {
    this._init.push({ method, path, func })
  }

  assign(routes: Routes) {
    for (let i = 0; i < routes._init.length; ++i) {
      this.create(
        routes._init[i].method,
        routes._init[i].path,
        routes._init[i].func
      )
    }
  }

  create(method: THTTPRequestMethods, path: string, func: (req: any, res: any) => void) {
    let current = this.root[method]
    const segments = buildServerSegments(path)

    for (let i = 0; i < segments.length; i++) {

      let newNode = new Node()
      newNode.value = segments[i].value!
      newNode.dynamic = segments[i].dynamic!

      if (!current.children[segments[i].value as string]) {
        current.children = {
          ...current.children,
          [segments[i].value as string]: {
            ...newNode
          }
        }
      }
      current = current.children[segments[i].value!]
    }
    current.isLeaf = true
    current.func = func
    console.log("Route created:", `[${method}]` + path)
  }

  async search(method: THTTPRequestMethods, url: string) {
    try {
      const segments = buildClientSegments(url);
      let dynamicSegments = {}
      let current = this.root[method];
      let prev = current;

      let i = 0;
      while (i < segments.length) {
        if (current) {
          current = (
            current.children[segments[i]] ||
            Object.values(prev.children).find(item => item.dynamic === true) ||
            null
          )
          if (current && current.dynamic === true) {
            dynamicSegments = {
              ...dynamicSegments,
              [current.value as string]: segments[i] as any
            }
          }
        }
        prev = current;
        i++
      }

      if (current && i === segments.length) {
        return {
          func: current.func,
          segments: dynamicSegments
        }

      }
      return null

    } catch (error) {
      console.log(error)
      return null
    }
  }
}
