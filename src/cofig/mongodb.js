import { MongoClient } from "mongodb";

let client;
export const connectToMongoDb = () => {
  MongoClient.connect(process.env.DB_URL)
    .then((clientInstance) => {
      console.log("MongoDB is connected.");
      client = clientInstance;
      createCounter(client.db());
      createIndexes(client.db());
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getClient = () => {
  return client;
};

export const getDb = () => {
  return client.db();
};

// Function to update your own ID to the mongodb database
const createCounter = async (db) => {
  try {
    const existingCounter = await db
      .collection("counters")
      .findOne({ _id: "cartItemId" });

    if (!existingCounter) {
      await db
        .collection("counters")
        .insertOne({ _id: "cartItemId", value: 0 });
    }
  } catch (err) {
    console.error(err);
  }
};

// Function to create indexes on product
const createIndexes = async (db) => {
  try {
    await db.collection("products").createIndex({ price: 1 });
    await db.collection("products").createIndex({ name: 1, category: -1 });
    await db.collection("products").createIndex({ desc: "text" });
    console.log(
      "Indexes has been created for price, category, description and name."
    );
  } catch (err) {
    console.error(err);
  }
};

// const url = "mongodb://localhost:27017";
// const dbName = "ecomdb";

// let client;

// const connectToMongoDb = async () => {
//   if (!client) {
//     try {
//       client = new MongoClient(url);
//       await client.connect();
//       console.log("MongoDB is connected.");
//     } catch (err) {
//       console.error("Failed to connect to MongoDB", err);
//       throw err;
//     }
//   }
//   return client.db(dbName);
// };

// export default connectToMongoDb;
