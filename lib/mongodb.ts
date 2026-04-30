import { MongoClient, Db } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
let dbInstance: Db;

export async function getDb(): Promise<Db> {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db("vinpro");
  }
  return dbInstance;
}