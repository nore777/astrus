# Astrus
Astrus is a Node.js web framework focused on fast API development. This project is in alpha and it **might contain breaking changes** in the future, use at your own discretion.

## getting started

```bash
npm i astrus
```

```javascript
import astrus from 'astrus' // Only supports ESM


const app = new astrus()

app.route('GET', '/hello/:segment', async (req, res) => {
  try {
    const { segment } = req.segments
    res.send(`hello ${segment}`)
  } catch (error) {
    res.error()
  }
})

app.route('POST', '/hello', async (req, res) => {
  try {
    res.send(req.body)
  } catch (error) {
    res.error()
  }
})

app.start(8000)
```

