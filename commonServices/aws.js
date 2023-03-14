"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBucketAndUpload = void 0;
// import S3, { ListObjectsV2Request } from 'aws-sdk/clients/s3'
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const constants_1 = __importDefault(require("../constants"));
const path_1 = __importDefault(require("path"));
require('dotenv').config();
const randomstring_1 = __importDefault(require("randomstring"));
// const s3 = new S3({ accessKeyId: process.env.ACCESSKEY_ID, secretAccessKey: process.env.SECRET_KEY })
function AWSConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new client_s3_1.S3Client({
                credentials: {
                    accessKeyId: process.env.ACCESSKEY_ID,
                    secretAccessKey: process.env.SECRET_KEY,
                },
                region: process.env.AWS_REGION
            });
            if (client) {
                return client;
            }
            else {
                return null;
            }
        }
        catch (err) {
            console.log(err);
            return null;
        }
    });
}
function createBucketAndUpload(bucketName, project, client, file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let awsClient = yield AWSConnect();
            let bucket;
            if (awsClient) {
                bucket = yield awsClient.send(new client_s3_1.CreateBucketCommand({ Bucket: bucketName }));
                if (bucket === null || bucket === void 0 ? void 0 : bucket.Location) {
                    const key = yield prepareAWSKey(awsClient, project, client, file);
                    if (key) {
                        const uploadObj = yield uploadFiletoAWS(awsClient, bucketName, key || '', file);
                        if (uploadObj) {
                            return uploadObj;
                        }
                        else {
                            console.log(constants_1.default.ERRORS.FILE_UPLOAD_FAILED);
                            return null;
                        }
                    }
                    else {
                        console.log(constants_1.default.ERRORS.INVALID_AWS_KEY);
                        return null;
                    }
                }
                else {
                    console.log(constants_1.default.ERRORS.BUCKET_NOT_CREATED);
                    return null;
                }
            }
            else {
                console.log(constants_1.default.ERRORS.AWS_CLIENT_CONNECT_FAIL);
                return null;
            }
        }
        catch (err) {
            console.log(err);
            return null;
        }
    });
}
exports.createBucketAndUpload = createBucketAndUpload;
function uploadFiletoAWS(client, bucket, key, file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const upload = yield (client === null || client === void 0 ? void 0 : client.send(new client_s3_1.PutObjectCommand({ Bucket: bucket, Key: key, Body: fs_1.default.createReadStream(file.path), ContentType: file.mimetype })));
            console.log('Upload Data: ', upload);
            if ((upload === null || upload === void 0 ? void 0 : upload.$metadata.httpStatusCode) === 200) {
                return key;
            }
            else {
                return null;
            }
        }
        catch (err) {
            console.log(err);
            return null;
        }
    });
}
function generateRandom() {
    let randomstrings = randomstring_1.default.generate({ length: 7, charset: 'alphanumeric' });
    return randomstrings;
}
function prepareAWSKey(awsClient, project, client, file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let key;
            let exists;
            do {
                key = (client === null || client === void 0 ? void 0 : client.ref) +
                    '-' +
                    (client === null || client === void 0 ? void 0 : client.name) +
                    '/' +
                    (project === null || project === void 0 ? void 0 : project.ref) +
                    '-' +
                    (project === null || project === void 0 ? void 0 : project.name) +
                    '/' +
                    generateRandom() +
                    path_1.default.extname(file.originalname);
                console.log('Key: ', key);
                try {
                    yield (awsClient === null || awsClient === void 0 ? void 0 : awsClient.send(new client_s3_1.HeadObjectCommand({ Bucket: process.env.BUCKET_NAME || '', Key: key })));
                    exists = true;
                }
                catch (err) {
                    if (err.name === 'NotFound') {
                        exists = false;
                    }
                    else {
                        console.log(err);
                        return null;
                    }
                }
            } while (exists);
            if (exists === false) {
                return key;
            }
            else {
                return null;
            }
        }
        catch (err) {
            console.log(err);
            return null;
        }
    });
}
