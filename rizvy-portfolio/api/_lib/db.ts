import { MongoClient, type Db } from "mongodb";

// The folder name starts with "_", so Vercel does not treat this file as an API route.

let clientPromise: Promise<MongoClient> | null = null;
let indexesReady = false;

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (!clientPromise) {
    clientPromise = new MongoClient(uri, { maxPoolSize: 5 }).connect();
  }
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB || "portfolio");

  if (!indexesReady) {
    await Promise.all([
      db.collection("visits").createIndex({ visitId: 1 }, { unique: true }),
      db.collection("visits").createIndex({ createdAt: -1 }),
      db.collection("visits").createIndex({ lastSeenAt: -1 }),
      db.collection("visits").createIndex({ visitorId: 1 }),
      // Rate-limit counters delete themselves automatically
      db.collection("ratelimits").createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 }),
    ]);
    indexesReady = true;
  }

  return db;
}