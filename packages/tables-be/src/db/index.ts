import { Row, Table, User } from "@tables/types";
import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

export const db = client.db("tables");
export const users = db.collection<User>("users");
export const tables = db.collection<Omit<Table, "body">>("tables");
export const rows = db.collection<Row>("rows");
users.createIndex("name", { unique: true, name: "name" });
