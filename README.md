# Astrus
Astrus is a Node.js web framework focused on fast API development. This project is in alpha and it **might contain breaking changes** in the future, use at your own discretion.

![Astrus](https://imgur.com/qfOjy3v.png)

[GITHUB](https://github.com/nore777/astrus) | [NPM](https://www.npmjs.com/package/astrus)

## Work in progress:
- ability to implement custom req and res functions
- cors implementation
- multipart streaming (currently loads into memory)

# Astrus Documentation

## Table of Contents
1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Static Files](#static-files)
4. [CORS Configuration](#cors-configuration)
5. [Controllers](#controllers)
6. [Middlewares](#middlewares)
7. [Routes](#routes)
   - [Basic Routes](#basic-routes)
   - [Route Arrays](#route-arrays)
   - [Dynamic Segments](#dynamic-segments)
8. [Request Handling](#request-handling)
   - [Multipart Form Data](#multipart-form-data)
   - [Low-Level Access](#low-level-access)
9. [Server Startup](#server-startup)

## Installation

```bash
npm i astrus
```

## Getting Started

Astrus only supports ESM imports:

```javascript
import astrus, { route, controller, middleware } from 'astrus'

// Create a new Astrus instance
const app = new astrus()
```

## Static Files

Serve static files from a directory:

```javascript
app.serveStatic('./public', '/public')
```

## CORS Configuration

Configure CORS options:

```javascript
app.corsOptions({
  // default options
  origin: null,                // Allow all origins when null
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: null,        // Which headers can be sent from the browser (null === all)
  exposedHeaders: null,        // Which headers can be accessible by the browser (null === all)
  credentials: false,          // Allow browser to send cookies to back-end
  optionsSuccessStatus: 204,   // Success status
  maxAge: 0,                   // How long to cache the preflight response in seconds
})
```

## Controllers

Create reusable controllers:

```javascript
const testController = controller((req, res) => {
  res.send("hello world")
})
```

## Middlewares

Create middleware functions with parameters:

```javascript
const testMiddleware = (roles) => middleware((req, res, next) => {
  const { role } = req.segments
  if (!roles.includes(role)) {
    return res.send("UNAUTHORIZED")
  }
  return next() // You must always use return when returning next or Response objects/functions
})

const middlewareRoute = route('POST', '/middleware', [testMiddleware(['admin', 'mod'])], (req, res) => {
  res.send("AUTHORIZED")
})
```

## Routes

### Basic Routes

Create a single route:

```javascript
const testRoute = route('GET', '/test0', testController)
app.route(testRoute)
```

### Route Arrays

Add multiple routes at once:

```javascript
const testRoutes = [
  route('GET', '/test1', testController),
  route('GET', '/test2', (req, res) => {
    res.send("hello world")
  }),
]
app.route(testRoutes) // Accepts arrays
```

### Dynamic Segments

Use route parameters (dynamic segments):

```javascript
app.route('GET', '/test4/:segment', (req, res) => {
  const { segment } = req.segments
  res.send(segment)
})
```

## Request Handling

### Multipart Form Data

Handle form data including file uploads:

```javascript
app.route('GET', '/test5', (req, res) => {
  const { image } = req.body
  res.header('Content-Type', image.mime)
  res.send(image.value)
})
```

### Low-Level Access

Access Node.js native IncomingMessage and ServerResponse objects:

```javascript
app.route('GET', '/test6', (req, res) => {
  res._.setHeader('Content-Type', 'application/json')
  res._.write(JSON.stringify({ address: req._.socket.remoteAddress }))
  res._.end()
  
  // NOTE: You can access the wrapper from the _ object, which holds the functions
  // implemented by Astrus, example:
  // res._.wrapper._.wrapper._.wrapper.send('')
  // This is expected behavior since both reference each other.
})
```

## Server Startup

Start the server with specified options:

```javascript
app.start(
  'http',                                 // Protocol
  8000,                                   // Port
  {},                                     // Options
  () => { console.log('server started') } // Callback
)
```
