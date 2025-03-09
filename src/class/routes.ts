import { buildServerSegments } from '../utils/segments'
import { THTTPRequestMethods } from '../types/types'
import { IncomingMessage, ServerResponse } from 'http'


class Node {
  type: string | undefined
  value: string | undefined
  func: () => void
  children: { [key: string]: Node }
  isLeaf: boolean

  constructor() {
    this.type = undefined
    this.value = undefined
    this.func = () => { }
    this.children = {}
    this.isLeaf = false
  }
}

export default class Routes {
  root: {
    GET: Node
    HEAD: Node
    POST: Node
    PUT: Node
    PATCH: Node
    DELETE: Node
  }

  constructor() {
    this.root = {
      GET: new Node(),
      HEAD: new Node(),
      POST: new Node(),
      PUT: new Node(),
      PATCH: new Node(),
      DELETE: new Node()
    }
  }

  create(method: THTTPRequestMethods, path: string, func: () => void) {
    let current = this.root[method as THTTPRequestMethods]
    const segments = buildServerSegments(path)

    for (let i = 0; i < segments.length; i++) {

      let newNode = new Node()
      newNode.value = segments[i].value!
      newNode.type = segments[i].type!

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
  }

}
