# Astrus
Astrus is a Node.js web framework focused on fast API development. This project is in alpha and it **might contain breaking changes** in the future, use at your own discretion.

## getting started

```bash
npm i astrus
```

```javascript
import astrus, { route, controller } from 'astrus' /* Only supports ESM */


// New Astrus instance
const app = new astrus()


// Controller
const testController = controller((req, res) => {
  res.send("hello world")
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

app.start(8000)
```

