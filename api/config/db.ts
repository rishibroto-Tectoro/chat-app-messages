import {MongoClient} from "mongodb";
//const con=   'mongodb://localhost:27017'
const con ='mongodb+srv://sujatha123:sujatha6376@cluster0.g7peyaj.mongodb.net/?retryWrites=true&w=majority'
const client =new MongoClient(con)

const db =client.db('chat-app')

export{db}