import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const config = {
  runtime: 'edge'
}

const app = new Hono({
  strict : false
}).basePath('/api')

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' })
})

export default handle(app)
