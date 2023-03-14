import { S3Client, ListObjectsV2Command, CreateBucketCommand, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import appConst from '../constants'
import path from 'path'
require('dotenv').config()
import randomstring from 'randomstring'

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

export async function createBucketAndUpload(bucketName: string, project: any, client: any, file: any[]) {
    try {
        console.log(file.length)
        let awsClient = await AWSConnect()
        let bucket;
        if (awsClient) {
            const uploadObjs = []
            const keyArray: any = []

            bucket = await awsClient.send(new CreateBucketCommand({ Bucket: bucketName }))
            if (bucket?.Location) {
                for (let i = 0; i < file.length; i++) {
                    console.log("One to One ---> ", file[i])
                    const key = await prepareAWSKey(awsClient, project, client, file[i])

                    if (key) {
                        keyArray.push(key)
                        const uploadObj = await uploadFiletoAWS(awsClient, bucketName, key || '', file[i])
                        uploadObjs.push(uploadObj)
                    } else {
                        console.log(appConst.ERRORS.INVALID_AWS_KEY)
                        return null
                    }
                }
                return keyArray

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

        const upload = await client?.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: fs.createReadStream(file.path) }))
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
        let keyArray: any = []

        do {
            key = client?.ref +
                '-' +
                client?.name +
                '/' +
                project?.ref +
                '-' +
                project?.name +
                '/sujatha/' +
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



