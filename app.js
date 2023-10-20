const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const ExemptionList = require("./routes/exemptionlist");
const ExemptionDao = require("./models/exemptionDao");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const basicAuth = require('express-basic-auth')

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(basicAuth({
  authorizeAsync: true,
  authorizer: (user, password, authorize) => authorize(null, password == 'secret'),
  challenge: true // <--- needed to actually show the login dialog!
}));

app.use("/", indexRouter);
app.use("/users", usersRouter);

//Todo App:
const cosmosClient = new CosmosClient({
  endpoint: config.host,
  key: config.authKey,
});
const exemptionDao = new ExemptionDao(
  cosmosClient,
  config.databaseId,
  config.containerId
);
const exemptionList = new ExemptionList(exemptionDao);
exemptionDao
  .init((err) => {
    console.error(err);
  })
  .catch((err) => {
    console.error(err);
    console.error(
      "Shutting down because there was an error settinig up the database."
    );
    process.exit(1);
  });

console.log("DB connected");

app.get("/exemptions", (req, res, next) => {
  exemptionList.showExemptions(req, res).catch(next);
});

app.get("/exemptions/:id", (req, res, next) => {
  console.log("get exmps by business Id");
  exemptionList.getExemptions(req, res).catch(next);
});

app.get("/overview/:id", (req, res, next) => {
  console.log("get exmps by Id");
  exemptionList.getExemption(req, res).catch(next);
});

// app.get("/exemptions", async (req, res, next) => {
//   console.log("get exmps");
//   const querySpec = {
//     query: "SELECT * from c",
//   };

//   const { resources: items } = await container.items
//     .query(querySpec)
//     .fetchAll();

//   return res.status(200).send(items);
// });

app.post("/addexemptions", (req, res, next) =>
  exemptionList.addExemptions(req, res).catch(next)
);
app.post("/updateExemptions", (req, res, next) =>
  exemptionList.updateExemptions(req, res).catch(next)
);
app.set("view engine", "jade");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
