import { Request, Router } from 'express'
const router = Router()
import multer from 'multer'
import randomstring from 'randomstring';
import path from 'path'
import * as controller from "../controller/controller";


export const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: any) {
        cb(null, 'uploads/')
    },

    filename: function (req: Request, file: any, cb: any) {
        cb(null, randomstring.generate({charset:"alphanumeric", length: 10})+path.extname(file?.originalname))
    },
})

export const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: (req: Request, file: any, cb: any) => {
        console.log('file2', file)
        // if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'text/plain') {
        //     console.log("file", file.mimetype)
        //     cb(null, true)
        // } else {
        //     cb(null, false)
        //     return cb(new Error('Only .tiff and .png format allowed!'))
        // }
        cb(null, true)
    },
})
router.post('/save',controller.add);
router.post('/uploadFile', uploadFile.single('file'),controller.CreateBucket)

export default router