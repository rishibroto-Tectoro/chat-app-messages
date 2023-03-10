// import S3, { ListObjectsV2Request } from 'aws-sdk/clients/s3'
import { S3Client, ListObjectsV2Command, CreateBucketCommand, GetObjectCommand, DeleteObjectCommand, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import appConst from '../constants'
import path from 'path'
require('dotenv').config()
import randomstring from 'randomstring'

// const s3 = new S3({ accessKeyId: process.env.ACCESSKEY_ID, secretAccessKey: process.env.SECRET_KEY })

async function AWSConnect() {
    try {
        const client = new S3Client(
            {
                credentials: {
                    accessKeyId: process.env.ACCESSKEY_ID!,
                    secretAccessKey: process.env.SECRET_KEY!,
                },
                region: process.env.AWS_REGION
            }
        )
        if (client) {
            return client
        } else {
            return null
        }
    } catch (err: any) {
        console.log(err)
        return null
    }
}

export async function createBucketAndUpload(bucketName: string, project: any, client: any, file: any) {
    try {
        let awsClient = await AWSConnect()
        let bucket;
        if (awsClient) {
            bucket = await awsClient.send(new CreateBucketCommand({ Bucket: bucketName }))
            if (bucket?.Location) {
                const key = await prepareAWSKey(awsClient, project, client, file)
                if (key) {
                    const uploadObj = await uploadFiletoAWS(awsClient, bucketName, key || '', file)
                    if (uploadObj) {
                        return uploadObj
                    } else {
                        console.log(appConst.ERRORS.FILE_UPLOAD_FAILED)
                        return null
                    }
                } else {
                    console.log(appConst.ERRORS.INVALID_AWS_KEY)
                    return null
                }
            } else {
                console.log(appConst.ERRORS.BUCKET_NOT_CREATED)
                return null
            }
        } else {
            console.log(appConst.ERRORS.AWS_CLIENT_CONNECT_FAIL)
            return null
        }
    } catch (err: any) {
        console.log(err)
        return null
    }
}

async function uploadFiletoAWS(client: S3Client | null, bucket: string, key: string, file: any) {
    try {
        const upload = await client?.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: fs.createReadStream(file.path), ContentType: file.mimetype }))
        console.log('Upload Data: ', upload)
        if (upload?.$metadata.httpStatusCode === 200) {
            return key
        } else {
            return null
        }
    } catch (err: any) {
        console.log(err)
        return null
    }
}

function generateRandom() {
    let randomstrings = randomstring.generate({ length: 7, charset: 'alphanumeric' })
    return randomstrings
}

async function prepareAWSKey(awsClient: S3Client | null, project: any, client: any, file: any) {
    try {
        let key: string
        let exists;
       
        do {
            key = client?.ref +
                '-' +
                client?.name +
                '/' +
                project?.ref +
                '-' +
                project?.name +
                '/' +
                generateRandom() +
                path.extname(file.originalname)
            console.log('Key: ', key)
            try {
                await awsClient?.send(new HeadObjectCommand({ Bucket: process.env.BUCKET_NAME || '', Key: key }))
                exists = true
            } catch (err: any) {
                if (err.name === 'NotFound') {
                    exists = false;
                }
                else {
                    console.log(err)
                    return null
                }
            }
        } while (exists);
        if (exists === false) {
            return key
        } else {
            return null
        }
    } catch (err: any) {
        console.log(err)
        return null
    }
}



