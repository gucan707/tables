import { MongoClient } from "mongodb";

import { Changes, Row, Table, User } from "@tables/types";

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

export const db = client.db("tables");
export const users = db.collection<User>("users");
export const tables = db.collection<Omit<Table, "rows">>("tables");
export const rows = db.collection<Row>("rows");
export const changes = db.collection<Changes>("changes");
users.createIndex("name", { unique: true, name: "name" });
