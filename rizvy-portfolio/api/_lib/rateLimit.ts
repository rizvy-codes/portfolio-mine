import type { Db } from "mongodb";

interface RateDoc {
  _id: string;
  count: number;
  expireAt: Date;
}

export async function getHits(db: Db, key: string): Promise<number> {
  const doc = await db.collection<RateDoc>("ratelimits").findOne({ _id: key });
  return doc?.count ?? 0;
}

export async function addHit(db: Db, key: string, windowMs: number): Promise<void> {
  await db.collection<RateDoc>("ratelimits").updateOne(
    { _id: key },
    { $inc: { count: 1 }, $setOnInsert: { expireAt: new Date(Date.now() + windowMs) } },
    { upsert: true }
  );
}