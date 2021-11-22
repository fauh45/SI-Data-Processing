import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
    }
  }
}

const mongo = new MongoClient(process.env.MONGO_URL, { maxPoolSize: 1000 });

interface UlasanCollection {
  id_produk: string;
  rating: number;
  komentar: string;
  update: boolean;
  sentiment: number;
}

const main = async () => {
  await mongo.connect();
  const db = mongo.db("ETLMongo");
  const review = db.collection<UlasanCollection>("Ulasan");

  console.log("Adding new update field");
  await review.updateMany({}, { $set: { update: false, sentiment: 0 } });
  console.log("Adding new update field done");

  await mongo.close();
};

main();
