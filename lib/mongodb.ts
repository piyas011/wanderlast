import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("MONGODB_URI is not configured.")
}

const globalForMongo = globalThis as typeof globalThis & {
  wanderlustMongoClient?: MongoClient
}

export const mongoClient =
  globalForMongo.wanderlustMongoClient ?? new MongoClient(uri)

if (process.env.NODE_ENV !== "production") {
  globalForMongo.wanderlustMongoClient = mongoClient
}

export const database = mongoClient.db("Wanderlust")
