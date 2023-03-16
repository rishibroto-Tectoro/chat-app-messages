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
        INTERNAL_SYSTEM_AWS: 'Internal System Error occurred while uploading. Please try again later or report to admin.',

        // CACHE ERRORS
        CACHE_INIT: "Error occurred while initializing cache. Check the logs.",
        CACHE_CONNECT: 'Connection to cache failed.',
        CACHE_CONNECT_TIMEOUT: 'Connection to cache timed out.',
        CACHE_CONNECT_HAD_ERROR:"Connection to cache closed with error"
    },
    MESSAGES: {
        AWS_UPLOAD_SUCCESS: 'File uploaded successfully',
        CACHE_CONNECT_SUCCESS: 'Cache connected successsfully.',
        CACHE_INIT_SUCCESS: 'Cache initialized successfully.'
    },
    

}
export default appConst