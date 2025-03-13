import ISegment from '../types/ISegment.js'

// parses url passed from client into segments
export function buildClientSegments(url: string): string[] {
  let segments: string[] = []
  let seg = ''
  let flag = true

  for (let i = 0; i <= url.length; i++) {
    if (url[i] === '/' || i + 1 > url.length) {
      if (flag) continue
      flag = true
      segments.push(seg)
      seg = ''
    } else {
      flag = false
      seg += url[i]
    }
  }

  return segments
}

// parses server-side route urls, and gives an object of segments
export function buildServerSegments(url: string) {
  let segments: ISegment[] = []
  let seg = ''
  let flag = true

  for (let i = 0; i <= url.length; i++) {
    if (url[i] === '/' || i + 1 > url.length) {
      if (flag) continue
      if (seg.startsWith(':')) {
        segments.push({ dynamic: true, value: seg.slice(1, seg.length) })
      } else {
        segments.push({ dynamic: false, value: seg })
      }
      flag = true
      seg = ''
    } else {
      flag = false
      seg += url[i]
    }
  }

  for (let i = 0; i < segments.length; i++) {
    for (let j = 0; j < segments.length; j++) {
      const s1 = segments[i]
      const s2 = segments[j]
      if (s1.dynamic && s2.dynamic && s1.value === s2.value && i !== j) {
        throw new Error(
          `Duplicate dynamic segments found at \x1b[31m${url}\x1b[0m, ${s1.value} === ${s2.value}`
        ).stack
      }
    }
  }

  return segments
}

