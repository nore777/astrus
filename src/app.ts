import http from 'http'
import { Request, Response } from './class/exchange'
import Routes from './class/routes'
import testRoutes from './routes/testRoute'


let routes = new Routes()
routes.assign(testRoutes)

const server = http.createServer({
  IncomingMessage: Request,
  ServerResponse: Response
}, async (req: Request, res: Response) => {


  res.end()
})

server.listen(8000, () => { console.log('Server started successfully') })
