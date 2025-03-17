import { _REQ } from "../class/request.js";
import { _RES } from "../class/response.js";


const parseBody = (route: Function, req: _REQ, res: _RES): void => {
  let body: Buffer = Buffer.from([])

  req.on('data', (chunk: any) => {
    body = Buffer.concat([body, chunk])
  });

  req.on('end', () => {
    const contentType = req.headers['content-type']

    try {
      if (contentType === 'application/json') {
        // parse json
        req.wrapper.body = JSON.parse(body.toString())

      } else if (contentType?.startsWith('multipart/form-data')) {
        // parse multipart
        const boundary = '--' + contentType.split('boundary=')[1]
        let lastBuffer: any = false
        let lastLine = ''
        let lastEndOfLine = 0
        let prevEndOfLine = 0
        let parsingValue = false
        let value: Buffer = Buffer.from([])
        let parsedBody: any = {}
        let mime = ''
        let tmp: any = {}

        for (let i = 0; i < body.length; i++) {

          if (body[i] === 0x0d && body[i + 1] === 0x0a) {
            lastBuffer = body.subarray(lastEndOfLine, i)
            lastLine = lastBuffer.toString()

            prevEndOfLine = lastEndOfLine
            lastEndOfLine = i
            const _lastLine = lastLine.trim().toLowerCase()
            if (_lastLine.startsWith('content-disposition')) {
              const _tmp = lastLine.trim().split(';')
              for (let j = 1; j < _tmp.length; j++) {
                const keyVal = _tmp[j].trim().split('=')
                tmp = {
                  ...tmp,
                  [keyVal[0]]: keyVal[1].substring(1, keyVal[1].length - 1)
                }
              }

            } else if (_lastLine.startsWith('content-type')) {
              mime = lastLine.split(':')[1].trim()

            } else if (_lastLine === '') {
              parsingValue = true

            } else if (parsingValue && _lastLine !== boundary && _lastLine !== boundary + '--') {
              value = Buffer.concat([value, lastBuffer])

            } else if (parsingValue && (_lastLine === boundary || _lastLine === boundary + '--')) {
              if (tmp.filename) {
                parsedBody = {
                  ...parsedBody,
                  [tmp.name]: {
                    mime: mime,
                    filename: tmp.filename,
                    value: value.subarray(2, value.length),
                  }
                }
                tmp.filename = undefined
              } else {
                parsedBody = {
                  ...parsedBody,
                  [tmp.name]: value.subarray(2, value.length).toString()
                }
              }
              mime = ''
              value = Buffer.from([])
            }
          }
        }
        req.wrapper.body = parsedBody

      } else {
        // plain text
        req.wrapper.body = body
      }
      route(req.wrapper, res.wrapper)
    } catch (error) {
      res.wrapper.error(400, "Bad Request")
    }
  })
}

export default parseBody
