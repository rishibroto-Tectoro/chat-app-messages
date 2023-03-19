import express, { Request, Response } from 'express';
import { Server } from 'socket.io'
import bodyPaser from 'body-parser';
import cors from 'cors';
import router from './api/router/router';
import { createServer } from 'http';
import { initCache } from './api/commonServices/cache'
const app = express();
const server = createServer(app)
const io = new Server(server)
app.set('io',io)
require('dotenv').config()
app.use(bodyPaser.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors())
app.use('/', router);

async function init() {
    try {
        await initCache()
        server.listen(process.env.PORT || 4002, () => {
            console.log(`Server listening at ${process.env.PORT || 4002}`)
        })
    } catch (err: any) {
        console.log(err)
    }
}
init()
