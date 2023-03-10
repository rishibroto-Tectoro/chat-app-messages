import express,{Request,Response} from 'express';

import bodyPaser from 'body-parser';
import cors from 'cors';
import router from './router/router';
const app =express();
require('dotenv').config()
app.use(bodyPaser.urlencoded({extended:true}))
app.use(bodyPaser.json());
app.use(cors())
app.use('/',router);

async function run() {
    app.listen(process.env.port,()=>{
        console.log(`server listening on port ${process.env.port}`)
    })
}
run()