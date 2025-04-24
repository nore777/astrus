# Astrus
Astrus is a Node.js web framework focused on fast API development. This project is in alpha and it **might contain breaking changes** in the future, use at your own discretion.

![Astrus](https://imgur.com/qfOjy3v.png)

[GITHUB](https://github.com/nore777/astrus) | [NPM](https://www.npmjs.com/package/astrus)

## getting started

```bash
npm i astrus
```

```javascript
import astrus, { route, controller. middleware } from 'astrus' /* Only supports ESM */


// New Astrus instance
const app = new astrus()


// Serve static files
app.serveStatic('./public', '/public')


// Cors (default options)
app.corsOptions({
  origin: null,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: null,
  exposedHeaders: null,
  credentials: false,
  optionsSuccessStatus: 204,
  maxAge: 0,
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
  return next()
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


// Start the app
app.start(8000, () => {console.log("server started successfully")})
```

