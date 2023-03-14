"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appConst = {
    STATUS: {
        SUCCESS: 'SUCCESS',
        FAIL: 'FAIL',
        IN_PROGRESS: 'IN PROGRESS',
    }, ERRORS: {
        USER_INSERTION_FAILED: 'Unable to insert User.',
        NO_RECORDS_FOUND: 'No Records Found.',
        //  AWS ERRORS
        NO_FILE: 'no files are uploaded',
        INVALID_AWS_KEY: "Invalid Key",
        FILE_UPLOAD_FAILED: 'file could not be uploaded please try again',
        BUCKET_NOT_CREATED: 'AWS Bucket could not be created',
        AWS_CLIENT_CONNECT_FAIL: 'Unable to connect to AWS Client. Please try again later',
        INTERNAL_SYSTEM_AWS: 'Internal System Error occurred while uploading. Please try again later or report to admin.'
    },
    MESSAGES: {
        AWS_UPLOAD_SUCCESS: 'File uploaded successfully'
    },
};
exports.default = appConst;
