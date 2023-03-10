"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongodb_1 = require("mongodb");
//const con=   'mongodb://localhost:27017'
const con = 'mongodb+srv://sujatha123:sujatha6376@cluster0.g7peyaj.mongodb.net/?retryWrites=true&w=majority';
const client = new mongodb_1.MongoClient(con);
const db = client.db('chat-app');
exports.db = db;
