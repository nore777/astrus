import IDynamicSegment from '../types/IDynamicSegment'
import ISegment from '../types/ISegment'

export function buildClientSegments(url: string): string[] {
  if (!url) return []
  let path = url
  let segments: string[] = []
  let seg = ''
  let flag = true
  for (let i = 0; i <= path.length; i++) {
    if (path[i] === '/' || i + 1 > path.length) {
      if (flag) continue
      flag = true
      segments.push(seg)
      seg = ''
    } else {
      flag = false
      seg += path[i]
    }
  }
  return segments
}

// parses server-side paths, and gives an object of segments
export function buildServerSegments(url: string) {
  if (!url) return []
  let path = url

  let segments: ISegment[] = []
  //let dynamicSegments: IDynamicSegment = {}
  let seg = ''
  let flag = true
  for (let i = 0; i <= path.length; i++) {
    if (path[i] === '/' || i + 1 > path.length) {
      if (flag) continue
      if (seg.startsWith(':')) {
        /*
        seg = seg.slice(1, seg.length)
        dynamicSegments = {
          ...dynamicSegments,
          [seg]: {
            type: 'd',
            value: '',
          }
        }
        */
        segments.push({ type: 'd', value: seg })
      } else {
        segments.push({ type: 's', value: seg })
      }
      flag = true
      seg = ''
    } else {
      flag = false
      seg += path[i]
    }
  }

  return segments
}

