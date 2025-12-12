import "dotenv/config"
import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error(
    "REDIS_URL env var is required but was not provided. Check your .env or deployment config."
  );
}

export const redis = new Redis(redisUrl);
