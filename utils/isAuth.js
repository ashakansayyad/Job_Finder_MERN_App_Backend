// a function that checks authenticsstion is true or false;

const dotenv = require("dotenv");
const jsonwebtoken = require("jsonwebtoken");
dotenv.config();
const isAuth = (req) => {
  const token = req.headers.authorization;
  if (!token) {
    return false;
  }
  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
};
module.exports = isAuth;
