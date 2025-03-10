import Routes from "../class/routes"
import { Request, Response } from "../class/exchange"


let routes = new Routes()

routes.init('GET', '/hello-world', async (_req: Request, res: Response) => {
  res.writeHead(200, 'OK', { 'content-type': 'text/html' })
  res.write('Hello from route!!!')
  res.end();
})

routes.init('GET', '/hello/:hello/world/:world', async (req: Request, res: Response) => {
  try {
    const { hello, world } = req.segments
    res.writeHead(200, 'OK', { 'content-type': 'text/html' })
    res.write(`${hello} ${world}`)
    res.end();
  } catch (error) {
    console.log(error)
  }
})

export default routes
