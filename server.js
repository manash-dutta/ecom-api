import "./env.js";
import express from "express";
import swagger from "swagger-ui-express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import cartRouter from "./src/features/cart/cartItems.routes.js";
// import basicAuthorizer from "./src/middlewares/basic.auth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import apiDocs from "./swagger-3.0.json" assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/application.errors.js";
import { connectToMongoDb } from "./src/cofig/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/cofig/mongooseConfig.js";
import likeRouter from "./src/features/like/like.routes.js";

const server = express();

// CORS policy configuration
let corsOptions = {
  origin: "http://localhost:5500",
};

server.use(cors(corsOptions));
// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5500"); // use * to make the api public
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // use * to allow all headers
//   res.header("Access-Control-Allow-Methods", "*"); // use * to allow all methods
//   // return ok for preflight requests
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

server.use(bodyParser.json());
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
// server.use(loggerMiddleware); // Applying middleware at application level
server.use("/api/products", loggerMiddleware, jwtAuth, productRouter);
server.use("/api/user", userRouter);
server.use("/api/cart", loggerMiddleware, jwtAuth, cartRouter);
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/likes", jwtAuth, likeRouter);

// Default request handler
server.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

// Middleware to handle 404 requests
server.use((req, res) =>
  res
    .status(404)
    .send(
      "API not found. Please check our documentation for more information at localhost:2200/api-docs"
    )
);

// Error Handler Middleware (should be placed last in the server)
server.use((err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }

  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }
  // server errors (add to logs)
  return res
    .status(500)
    .send("Something went wrong, please try again later...");
});

server.listen(2200, () => {
  console.log("Server listing on port 2200 ");
  // connectToMongoDb();
  connectUsingMongoose();
});
