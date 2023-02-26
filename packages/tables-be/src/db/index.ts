import { ReqCreateUser, User } from "@tables/types";
import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

export const db = client.db("tables");
export const users = db.collection<User>("users");
users.createIndex("name", { unique: true, name: "name" });
