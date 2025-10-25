import { MongoClient } from "mongodb"
import { ObjectId } from "mongodb"
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const url = Deno.env.get("MONGO_URL")

if(!url){
  throw new Error("MONGO_URL is not set")
}

const client = new MongoClient(url)

try {
  await client.connect();
  console.info("Connected to MongoDB");
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
  throw error;
}

const db = client.db("nydiaDB")
const usersCollection = db.collection("users")
export default usersCollection