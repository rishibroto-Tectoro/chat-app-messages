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
exports.CreateBucket = exports.add = void 0;
const db_1 = require("../config/db");
const record = db_1.db.collection('messages');
const randomstring_1 = __importDefault(require("randomstring"));
const constants_1 = __importDefault(require("../constants"));
const aws_1 = require("../commonServices/aws");
//add data into database
function add(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body && Array.isArray(req.body)) {
                const resp = yield record.insertMany(req.body);
                res.status(200).json({ status: constants_1.default.STATUS.SUCCESS, response: resp, message: null });
            }
            else {
                const resp = yield record.insertOne(req.body);
                res.status(200).json({ status: constants_1.default.STATUS.SUCCESS, response: resp, message: null });
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ status: constants_1.default.STATUS.FAIL, response: null, message: error.message });
        }
    });
}
exports.add = add;
function CreateBucket(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let ref;
            // let count:any ;
            const resp = yield (0, aws_1.createBucketAndUpload)(process.env.BUCKET_NAME || '', { ref: 'P1', name: 'P1' }, { ref: 'C1', name: 'C1' }, req.file);
            //do {
            ref = 'F' + randomstring_1.default.generate({ length: 5, charset: 'numeric' });
            // } while (count> 0)
            if (resp && ref) {
                res.status(201).json({ status: constants_1.default.STATUS.SUCCESS, response: null, message: constants_1.default.MESSAGES.AWS_UPLOAD_SUCCESS });
            }
            else {
                res.status(400).json({ status: constants_1.default.STATUS.FAIL, response: null, message: constants_1.default.ERRORS.INTERNAL_SYSTEM_AWS });
            }
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ status: constants_1.default.STATUS.FAIL, response: null, message: err.message });
        }
    });
}
exports.CreateBucket = CreateBucket;
