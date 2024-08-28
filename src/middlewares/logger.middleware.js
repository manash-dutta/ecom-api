import winston from "winston"; ///lib/winston/config
// import fs from "fs";

// const fsPromise = fs.promises;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

const loggerMiddleware = (req, res, next) => {
  if (!req.url.includes("signin")) {
    // Log request body
    const logData = `url: ${req.originalUrl} - ${JSON.stringify(req.body)}`;
    logger.info(logData);
  }
  next();
};

export default loggerMiddleware;