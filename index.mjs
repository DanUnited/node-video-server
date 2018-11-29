import express from 'express'
import http from 'http'
import dotEnv from 'dotenv'
import bodyParser from 'body-parser'

import {Routes} from './app/routes'
import {socket} from './app/services/socket'

dotEnv.config()

const STREAM_PORT = process.env.STREAM_PORT,
  WEBSOCKET_PORT = process.env.WEBSOCKET_PORT

const app = express()

const router = express.Router();
const server = http.createServer(app)

socket.init({
  server,
  port: WEBSOCKET_PORT,
  perMessageDeflate: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(Routes(router, socket.get(), app))

app.listen(STREAM_PORT, () => {
  console.log(`SERVER STARTED ON PORT: ${STREAM_PORT}`)
})
