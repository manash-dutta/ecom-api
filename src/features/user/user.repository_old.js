import { getDb } from "../../cofig/mongodb.js";
import { ApplicationError } from "../../error-handler/application.errors.js";

export default class UserRepository {
  async signUp(newUser) {
    try {
      // Get the Database
      const db = getDb();
      // Get the desired collection
      const collection = db.collection("users");
      // Insert the document into the collection
      await collection.insertOne(newUser);
      return newUser;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Database!", 500);
    }
  }

  async signIn(email, password) {
    try {
      // Get the Database
      const db = getDb();
      // Get the desired collection
      const collection = db.collection("users");
      // Find the document
      return await collection.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Database!", 500);
    }
  }

  async findByEmail(email) {
    try {
      // Get the Database
      const db = getDb();
      // Get the desired collection
      const collection = db.collection("users");
      // Find the document
      return await collection.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with Database!", 500);
    }
  }
}
