import {MongoClient} from "mongodb";
//const con=   'mongodb://localhost:27017'
const con ='mongodb+srv://prk03696:parvezkhan@cluster0.p4rbt6j.mongodb.net/?retryWrites=true&w=majority'
const client =new MongoClient(con)

const db =client.db('chat-application')

export{db}