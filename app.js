const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const schema = require("./Schema/Schema");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

mongoose.connect(process.env.MDB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("Yes ! We are connected to mongoDB");
});
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);
app.use(
  cors({
    origin: ["http://localhost:4000"],
    credentials: true,
  })
);

app.listen(4000, () => {
  console.log("Server is Running on 4000");
});
