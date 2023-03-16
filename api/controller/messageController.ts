import {Request, Response} from "express";
import {db} from "../config/db";
const record = db.collection("messages");
import randomstring from "randomstring";
import appConst from "../constants";
import * as path from "path";
import {createBucketAndUpload} from "../commonServices/aws";
import {Socket} from "socket.io";
import {Tedis} from "tedis";
import {createRecordKey, redisConnect} from "../../api/commonServices/cache";

//add data into database

export async function add(req: Request, res: Response): Promise<any> {
  try {
    let ref;
    if (req.files) {
      const resp = await createBucketAndUpload(
        process.env.BUCKET_NAME || "",
        {ref: "P1", name: "P1"},
        {ref: "C1", name: "C1"},
        req.files as any[]
      );
      let obj2 = JSON.parse(req.body.message);
      obj2.messages["files"] = resp;
      req.body.message = JSON.parse(JSON.stringify(obj2));
      req.body["ref"] =
        "M" + randomstring.generate({length: 5, charset: "numeric"});
      console.log("body: ", JSON.stringify(req.body));
      //Added to DB
      req.body["created_at"] = new Date().toISOString();
      let response = await record.insertOne(req.body);

      // Send through sockets.io
      const io = req.app.get("io");
      sendMessagesThroughSocket(req.body, io);

      res.status(201).json({
        status: appConst.STATUS.SUCCESS,
        response: null,
        message: appConst.MESSAGES.AWS_UPLOAD_SUCCESS,
      });
    } else {
      const resp = await record.insertOne(req.body);
      // Send through sockets.io
      const io = req.app.get("io");
      sendMessagesThroughSocket(req.body, io);
      res
        .status(200)
        .json({status: appConst.STATUS.SUCCESS, response: resp, message: null});
    }
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: appConst.STATUS.FAIL,
      response: null,
      message: error.message,
    });
  }
}

export async function find(req: Request, res: Response): Promise<any> {
  try {
    let resp = [];
    let body = (req.body.where = req.body.where ? req.body.where : {});
    let client: any = await redisConnect();
    // let key =  await createRecordKey(body._id, "*");
    // console.log("-------key--1111---",key)

    // console.log("key: ", key.response);
    const keys: any = await client.keys("*" + body._id + "*");
    console.log("keys--", keys);
    // Fetch from cache
    if (keys && keys.length > 0) {
      console.log("Keys: ", keys);

      //if Pagination params provided
      if ((req.body.skip || req.body.skip === 0) && req.body.take) {
        while (resp.length < req.body.take) {
          resp.push(JSON.parse(await client.get(keys[req.body.skip])));
          req.body.skip++;
        }
        // If pagination params not provided
      } else {
        for (let key of keys) {
          console.log("key1", key);
          resp.push(JSON.parse(await client.get(key)));
        }
      }
      res
        .status(200)
        .json({status: appConst.STATUS.SUCCESS, response: resp, message: null});
    }
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: appConst.STATUS.FAIL,
      response: null,
      message: error.message,
    });
  }
}

async function sendMessagesThroughSocket(message: any, io: Socket) {
  for (let to of message.to) {
    io.emit(to, message);
  }
}
