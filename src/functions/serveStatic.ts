import fs from 'fs'
import fileToContentType from '../utils/fileToContentType.js'
import { Response } from '../class/response.js'
import { Request } from '../class/request.js'
import Astrus from '../class/astrus.js'


function serveStatic(this: Astrus, directory: string, url: string) {
  this.route('GET', url + '/*', async (req: Request, res: Response) => {
    try {
      const _url = req.url.substring(url.length, req.url.length)
      const filePath = directory + _url
      const fileExt = _url.split('.')[1]
      const fileSize = fs.statSync(filePath).size
      const readStream = fs.createReadStream(filePath, { highWaterMark: 16 * 1024 })
      const contentType = fileToContentType[fileExt] || 'application/octet-stream'

      res._.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': fileSize,
      })

      readStream.on('data', async (chunk) => {
        res._.write(chunk);
      });

      readStream.on('end', () => {
        res._.end();
      });

      readStream.on('error', () => {
        res._.end()
      });

    } catch (error) {
      res._.end()
    }
  })
}

export default serveStatic
