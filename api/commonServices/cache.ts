import {db} from "../config/db";
const messages = db.collection("messages");
import appConst from "../constants";
import {Request, Response} from "express";
import {Tedis} from "tedis";
let cache: Tedis | null;
async function tedisInit() {
  if (cache) {
    return cache;
  } else {
    cache = new Tedis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "") || 6379,
    });

    cache.on("connect", () => {
      console.log(appConst.MESSAGES.CACHE_CONNECT_SUCCESS);
    });
    cache.on("timeout", () => {
      console.log(appConst.ERRORS.CACHE_CONNECT_TIMEOUT);
    });
    cache.on("error", (err) => {
      console.log(appConst.ERRORS.CACHE_CONNECT, ": ", err);
      cache = null;
    });
    cache.on("close", (had_error) => {
      console.log(appConst.ERRORS.CACHE_CONNECT_HAD_ERROR, ": ", had_error);
      cache = null;
    });
    return cache;
  }
}
export const redisConnect = async () => {
  try {
    let cache = await tedisInit();
    if (cache) {
      return cache;
    } else {
      return null;
    }
  } catch (err: any) {
    console.log(err);
    return null;
  }
};

export async function initCache() {
  try {
    let cache: Tedis | null = await redisConnect();
    if (cache) {
      await cache.command("FLUSHALL");
      const initResponse = await addRecordToCache();
      if (initResponse.status === appConst.STATUS.SUCCESS) {
        console.log(appConst.MESSAGES.CACHE_INIT_SUCCESS);
        return {status: appConst.STATUS.SUCCESS};
      } else {
        console.log(appConst.ERRORS.CACHE_INIT);
        return {status: appConst.STATUS.FAIL};
      }
    } else {
      console.log(appConst.ERRORS.CACHE_CONNECT);
      return {status: appConst.STATUS.FAIL};
    }
  } catch (err: any) {
    console.log(err);
    return {status: appConst.STATUS.FAIL};
  }
}

async function addRecordToCache() {
  try {
    // let projects = await prisma.project.findMany({ select: { ref: true, name: true, status: true, isLaunched: true, type: true, assignedUsers: { select: { ref: true } }, projectManager: { select: { ref: true } } } })
    let records:any = await messages.find({}).toArray();
    console.log("records---->", records);
    for (let record of records) {
      let cache: Tedis | null = await redisConnect();
      if (cache) {
        let key = await createRecordKey(record, "MESSAGE#");
        if (key?.status === appConst.STATUS.SUCCESS && key?.response) {
            console.log("----keys---- ",key)
          cache.set(key.response, JSON.stringify(record));
        } else {
          console.log(
            "Unable to set cache for record: ",
            JSON.stringify(record),
            "with key: ",
            key.response,
            ". Aborting!!"
          );
          await cache.command("FLUSHALL");
          return {status: appConst.STATUS.FAIL, response: null, message: null};
        }
      } else {
        console.log(appConst.ERRORS.CACHE_CONNECT);
        return {
          status: appConst.STATUS.FAIL,
          response: null,
          message: "Connection to cache failed.",
        };
      }
    }
    return {status: appConst.STATUS.SUCCESS, response: null, message: null};
  } catch (err: any) {
    console.log(err);
    return {status: appConst.STATUS.FAIL, response: null, message: err.message};
  }
}

export async function createRecordKey(record: any, key: string) {
  try {
    console.log("-------->>> inside create key");
    console.log("----inside key----",record)
    if (record?._id) {
      key += "ID:" + record._id + "#";
    }
    if (Array.isArray(record?.to)) {
      let subKey = "";
      for (let one of record.to||[]) {
        subKey += "TO:"+one+'#';
      }
      key += subKey;
    }
    else if(record?.to)
    {
        key += "TO:" + record.to + "#";
    }
    if (record?.from) {
      key += "FROM:" + record.from + "#";
    }

    return {status: appConst.STATUS.SUCCESS, response: key, message: null};
  } catch (err: any) {
    console.log(err);
    return {status: appConst.STATUS.FAIL, response: null, message: err.message};
  }
}

export async function cacheInit(req: Request, res: Response) {
  try {
    let resp = await initCache();
    resp.status === appConst.STATUS.SUCCESS
      ? res.status(200).json({status: appConst.STATUS.SUCCESS})
      : res.status(400).json({status: appConst.STATUS.FAIL});
  } catch (err) {
    console.log(err);
    res.status(400).json({status: appConst.STATUS.FAIL});
  }
}
