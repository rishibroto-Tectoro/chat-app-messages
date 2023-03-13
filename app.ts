import express,{Request,Response} from 'express';

import bodyPaser from 'body-parser';
import cors from 'cors';
import router from './api/router/router';
const app =express();
require('dotenv').config()
app.use(bodyPaser.urlencoded({extended:true}))
app.use(express.json());
app.use(cors())
app.use('/',router);

async function run() {
    app.listen(process.env.port,()=>{
        console.log(`server listening on port ${process.env.port}`)
    })
}
run()