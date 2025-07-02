import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env as MONGODB_URI');
}

if (process.env.NODE_ENV === 'development') {

  // In development, use a global variable so the client is cached between hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
  
} else {
  // In production, create a new client for every call
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
    const client = await clientPromise;
    return client.db(dbName)
}

export default clientPromise;