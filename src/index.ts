import app from './main'
import * as http from 'http'

const port: number = 3939 || process.env.PORT
const server = http.createServer(app.instance)

server.listen(port, () => {
  console.log(`This server is running on port: ${port}`);
})