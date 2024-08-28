import fs from "fs";

const fsPromise = fs.promises;
// Note: fs has an object named promises which allows us to create and write data into files asyncronously without using callbacks

async function log(logData) {
  try {
    logData = `${new Date().toLocaleString()} - ${logData}\n`;
    await fsPromise.appendFile("log.txt", logData);
  } catch (error) {
    console.log(error);
  }
}

const loggerMiddleware = async (req, res, next) => {
  if (!req.url.includes("signin")) {
    // Log request body
    const logData = `url: ${req.url} - ${JSON.stringify(req.body)}`;
    await log(logData);
  }
  next();
};

export default loggerMiddleware;
