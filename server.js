const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const bodyParser = require("body-parser");
const { incommingRequest } = require("./middleware/incomingMiddle.js");
const homeRoute = require("./routes/homeRoute.js");
const userRoute = require("./routes/userRoutes.js");
const jobRoute = require("./routes/jobRoute.js");
const cors = require("cors");
const app = express();
dotenv.config();

app.use(bodyParser.json()); //it parse on json data
app.use(bodyParser.urlencoded({ extended: true })); //it parse also form data
app.use(cors());
app.use(incommingRequest);
app.use("/api", homeRoute);
app.use("/api/user", userRoute);
app.use("/api/job",jobRoute);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MogoDB Connected Successfully!"))
  .catch((err) => console.log("Connection Error: ", err));

const PORT = process.env.PORT;
// console.log(process);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
