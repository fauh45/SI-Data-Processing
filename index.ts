import dotenv from "dotenv";
import translate from "@asmagin/google-translate-api";
import Sentiment from "sentiment";
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
const sentiment = new Sentiment();

const getSentiment = async (review: string): Promise<number> => {
  const eng = await translate(review, { to: "id" });

  return sentiment.analyze(eng.text).score;
};

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

  const oneReview = await review.findOne({ update: true });

  if (oneReview) console.log(getSentiment(oneReview.komentar));

  await mongo.close();
};

main();
