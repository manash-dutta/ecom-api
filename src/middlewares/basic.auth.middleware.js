import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  // Check if authorization header is empty
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("No authorization details found");
  }
  console.log(authHeader);
  // Extract Credentials [Basis akjwshesr9383ehjkasdnv]
  const base64Credentials = authHeader.replace("Basic ", "");
  console.log(base64Credentials);
  // Decode the Credentials
  const decodedCreds = Buffer.from(base64Credentials, "base64").toString(
    "utf8"
  );
  console.log(decodedCreds); // [username:password]
  const credentials = decodedCreds.split(":");
  const user = UserModel.getAll().find(
    (user) => user.email === credentials[0] && user.password === credentials[1]
  );
  if (user) {
    next();
  } else {
    return res.status(401).send("Invalid Credentials");
  }
};

export default basicAuthorizer;
