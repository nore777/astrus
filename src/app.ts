import http, { IncomingMessage, ServerResponse } from 'http'
import Routes from './class/routes'
import { buildServerSegments, buildClientSegments } from './utils/segments';


let routes = new Routes()

routes.create('GET', '/hello-world', async () => {
  try {
    throw Error("XDD")
  } catch (error) {
    console.log(error)
  }
})


let totalElapsedTime = 0;
let requestCount = 0;

http.createServer(function(req: IncomingMessage, res: ServerResponse) {
  const start = process.hrtime();
  ////////////////////////////////////////////////////////////////////////


  const segments = buildClientSegments(req.url as string)
  res.writeHead(200, "OK", { 'content-type': 'application/json' })
  res.write(JSON.stringify({ segments }))
  res.end();

  ////////////////////////////////////////////////////////////////////////
  const [seconds, nanoseconds] = process.hrtime(start);
  totalElapsedTime += nanoseconds;
  requestCount++;
  const averageTime = totalElapsedTime / requestCount;
  console.log(`Elapsed time: ${nanoseconds / 1000000}ms ${nanoseconds}ns`);
  console.log(`Average     : ${averageTime}ns`);
}).listen(8000, () => {
  console.log('Server started successfully')
});
