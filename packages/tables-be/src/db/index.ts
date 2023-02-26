import { MongoClient } from "mongodb";
// import { dbPw, dbUserName } from "./dbInfo";

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

export const db = client.db("tables");
