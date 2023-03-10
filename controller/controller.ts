import { Request, Response } from "express";
import { db } from "../config/db";
const record = db.collection('messages');
import randomstring from 'randomstring';
import appConst from '../constants'
import { createBucketAndUpload } from "../commonServices/aws";


//add data into database

export async function add(req: Request, res: Response): Promise<any> {
    try {
        if (req.body && Array.isArray(req.body)) {
            const resp = await record.insertMany(req.body);
            res.status(200).json({ status: appConst.STATUS.SUCCESS, response: resp, message: null })
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

export async function CreateBucket(req: Request, res: Response): Promise<any> {
    try {
        let ref;
       // let count:any ;
        const resp = await createBucketAndUpload(process.env.BUCKET_NAME || '',{ref:'P1',name:'P1'},{ref:'C1',name:'C1'},req.file)
        //do {
            ref = 'F' + randomstring.generate({ length: 5, charset: 'numeric' })
       // } while (count> 0)
        if(resp && ref) {
          
            res.status(201).json({status: appConst.STATUS.SUCCESS, response: null, message: appConst.MESSAGES.AWS_UPLOAD_SUCCESS})
        } else {
            res.status(400).json({status: appConst.STATUS.FAIL, response: null, message: appConst.ERRORS.INTERNAL_SYSTEM_AWS})
        }
       
    } catch(err:any) {
        console.log(err)
        res.status(400).json({status: appConst.STATUS.FAIL, response: null, message: err.message})

    }
}