import { Request, Response } from "express";
import { db } from "../config/db";
const record = db.collection('messages');
import randomstring from 'randomstring';
import appConst from '../constants'
import * as path from "path";
import { createBucketAndUpload } from "../commonServices/aws";


//add data into database

export async function add(req: Request, res: Response): Promise<any> {
    try {
        let ref;
        if (req.body) {
            const resp = await createBucketAndUpload(process.env.BUCKET_NAME || '', { ref: 'P1', name: 'P1' }, { ref: 'C1', name: 'C1' }, req.files as any[])
            let obj2 = JSON.parse(req.body.message)
            obj2.messages['files'] = resp
            req.body.message = JSON.parse(JSON.stringify(obj2))
            req.body['ref'] = 'M' + randomstring.generate({ length: 5, charset: 'numeric' })
            console.log("body: ", JSON.stringify(req.body))
            let response = await record.insertOne(req.body)
            res.status(201).json({ status: appConst.STATUS.SUCCESS, response: null, message: appConst.MESSAGES.AWS_UPLOAD_SUCCESS })
        }
        else {
            const resp = await record.insertOne(req.body)
            res.status(200).json({ status: appConst.STATUS.SUCCESS, response: resp, message: null })

        }
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ status: appConst.STATUS.FAIL, response: null, message: error.message })

    }
}

