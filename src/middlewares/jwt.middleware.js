import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  // Read the token
  const token = req.headers["authorization"];
  // If no token, return the error
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  // check if token is valid
  try {
    const payload = jwt.verify(token, "Z8lb1vkwsfKwqnmYduQeToCByyWcrIuu");
    req.userId = payload.userId;
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

export default jwtAuth;
