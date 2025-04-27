# Astrus
Astrus is a Node.js web framework focused on fast API development. This project is in alpha and it **might contain breaking changes** in the future, use at your own discretion.

![Astrus](https://imgur.com/qfOjy3v.png)

[GITHUB](https://github.com/nore777/astrus) | [NPM](https://www.npmjs.com/package/astrus)

## work in progress:
- ability to implement custom req and res functions
- cors implementation
- multipart streaming (currently loads into memory)

## getting started

```bash
npm i astrus
```

```javascript
import astrus, { route, controller, middleware } from 'astrus' /* Only supports ESM */


// New Astrus instance
const app = new astrus()


// Serve static files
app.serveStatic('./public', '/public')


// Cors
app.corsOptions({
  // default options
  origin: null,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: null,      // which headers can be send from the browser (null === all)
  exposedHeaders: null,      // which headers can be accessible by the browser (null === all)
  credentials: false,        // allow browser to send cookies to back-end
  optionsSuccessStatus: 204, // success status
  maxAge: 0,                 // how long to cache the preflight response in seconds
})


// Controller
const testController = controller((req, res) => {
  res.send("hello world")
})


// Middlewares
const testMiddleware = (roles) => middleware((req, res, next) => {
  const { role } = req.segments
  if (!roles.includes(role)) {
    return res.send("UNAUTHORIZED")
  }
  return next() // you must always use return when returning next or Response objects or functions
})

const middlewareRoute = route('POST', '/middleware', [testMiddleware(['admin', 'mod'])], (req, res) => {
  res.send("AUTHORIZED")
})


// Different route initiations
const testRoute = route('GET', '/test0', testController)
const testRoutes = [
  route('GET', '/test1', testController),
  route('GET', '/test2', (req, res) => {
    res.send("hello world")
  }),
]

app.route(testRoute)
app.route(testRoutes) // accepts arrays


// Dynamic segments (params)
app.route('GET', '/test4/:segment', (req, res) => {
  const { segment } = req.segments
  res.send(segment)
})


// Supports multipart form-data
app.route('GET', '/test5', (req, res) => {
  const { image } = req.body
  res.header('Content-Type', image.mime)
  res.send(image.value)
})


// Get lower level variables and functions from IncomingMessage and ServerResponse via the '_' object
app.route('GET', '/test6', (req, res) => {
  res._.setHeader('Content-Type', 'application/json')
  res._.write(JSON.stringify({ address: req._.socket.remoteAddress }))
  res._.end()

  // NOTE: you can access the wrapper from the _ object, which holds the functions
  // implemented by Astrus, example:
  // res._.wrapper._.wrapper._.wrapper.send('')
  // This is expected behaviour since both reference each other.
})


// Start the app
app.start(
  'http',                                 // protocol
  8000,                                   // port
  {},                                     // options
  () => { console.log('server started') } // callback
)
```

