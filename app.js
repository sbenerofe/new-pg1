import createError from "http-errors";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import logger from "morgan";
import * as dotenv from "dotenv";
import cors from "cors";
import errorHandlerMiddleware from "./middleware/errorHandler.js";

//import routes
//import v1router from "./routes/routes.v1.js";

//import hierarchicalPosts from "./helpers/hierarchicalQuery.js";

//generate these constants bc they are not otherwise availible when using "type": module ES 6 Modules
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//console.log('use test db = ', usetestdb);

const app = express();
dotenv.config();
app.use(express.json()); //app.use(bodyParser.json());app.use(logger('dev'));
app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//app.use("/api/v1/", v1router);
app.use("/", function (req, res) {
  res.send("homepage");
});

app.use(errorHandlerMiddleware);

//server is created and started here
// import Redis from 'ioredis';
// const redisClient = await new Redis({
//   host: '127.0.0.1',
//   port: 6379,
// });
// await redisClient.set('myname', 'Simon Prickett');

// // Get the value held at key "myname" and log it.
// const value = await redisClient.get('myname');
// console.log('????????', value);

//server is created and started here
const PORT = process.env.PORT || 3000;

console.log("process.env.APP_ENV = ", process.env.APP_ENV);

//console.log("hierarchicalPosts = ", hierarchicalPosts);

app.listen(PORT, () =>
  console.log(
    `Server started for (db) ${process.env.DB_DEVELOPMENT_DATABASE} at port ${PORT} `
  )
);

export default app;

//in top level package.json
//"dev": "nodemon -r dotenv/config app.js"
//https://medium.com/@pdx.lucasm/dotenv-nodemon-a380629e8bff

//to use package.json in folders so that can use require even if "type": module set in top level package.json
//https://stackoverflow.com/questions/68304477/sequelize-run-migration-with-es6-and-modules
