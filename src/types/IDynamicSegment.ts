export default interface IDynamicSegment {
  [key: string]: {
    value?: string
    type?: 's' /*static*/ | 'd' /*dynamic*/,
  }
}
