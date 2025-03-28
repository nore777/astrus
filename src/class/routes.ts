import { buildClientSegments, buildServerSegments } from '../utils/segments.js'
import { THTTPRequestMethods, TMiddlewares, TRouteHandler } from '../types/types.js'
import { _REQ, Request } from './request.js'
import { Response } from './response.js'
import IRoute from '../types/IRoute.js'


class Node {
  dynamic: boolean | undefined
  wildcard: boolean | undefined
  value: string | undefined
  middlewares?: TMiddlewares | undefined
  func: TRouteHandler
  children: { [key: string]: Node }
  isLeaf: boolean

  constructor() {
    this.dynamic = undefined
    this.wildcard = undefined
    this.value = undefined
    this.func = () => { }
    this.children = {}
    this.isLeaf = false
  }
}


export default class Routes {

  private _init: IRoute[]

  private root: {
    GET: Node
    HEAD: Node
    POST: Node
    PUT: Node
    DELETE: Node
    CONNECT: Node
    OPTIONS: Node
    TRACE: Node
    PATCH: Node
  }

  constructor() {
    this._init = []

    this.root = {
      GET: new Node(),
      HEAD: new Node(),
      POST: new Node(),
      PUT: new Node(),
      DELETE: new Node(),
      CONNECT: new Node(),
      OPTIONS: new Node(),
      TRACE: new Node(),
      PATCH: new Node(),
    }
  }

  /**
   * Initializes a new route.
   */
  init(route: IRoute) {
    this.create(route)
    this._init.push(route)
  }

  private create(route: IRoute) {
    let current = this.root[route.method]
    const segments = buildServerSegments(route.path)

    for (let i = 0; i < segments.length; i++) {

      let newNode = new Node()
      newNode.value = segments[i].value
      newNode.dynamic = segments[i].dynamic
      newNode.wildcard = segments[i].wildcard

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

    if (route.middlewares) {
      current.middlewares = route.middlewares
    }

    current.func = route.func
    current.isLeaf = true
  }

  search(req: _REQ) {
    const segments = buildClientSegments(req.url as string);
    let dynamicSegments = {}
    let current = this.root[req.method as THTTPRequestMethods];
    let prev = current;
    let foundWildcard = false

    if (segments.length === 0 && !current.isLeaf) {
      return null
    }

    let i = 0;
    while (i < segments.length) {
      if (current) {
        current = (
          current.children[segments[i]] ||
          Object.values(prev.children).find(item => item.dynamic === true) ||
          Object.values(prev.children).find(item => item.wildcard === true) ||
          null
        )
        if (current && current.wildcard === true) {
          foundWildcard = true
          break;
        }
        if (current && current.dynamic === true) {
          dynamicSegments = {
            ...dynamicSegments,
            [current.value as string]: segments[i] as string | number
          }
        }
      }

      prev = current;
      i++
    }

    req.wrapper.url = req.url as string

    if (foundWildcard) {
      return current
    }

    if (current && i === segments.length) {
      req.wrapper.segments = dynamicSegments
      return current
    }

    return null
  }
}

