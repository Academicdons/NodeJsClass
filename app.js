var express = require("express");
var app = express();
//Import the mongoose module
var mongoose = require("mongoose");
var UserDatamodel = require("./classes");
var bodyParser = require("body-parser");
const router = require("express").Router();

require("dotenv").config();
app.use(bodyParser.json()); // Used to parse JSON bodies
// or
app.use(bodyParser.urlencoded({ extended: true }));

//Set up default mongoose connection

const uri =
  "mongodb+srv://node:node1234@cluster0.fpkv1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// var mongoDB = "mongodb://localhost:27017/UserData";
mongoose
  .connect(uri)
  .then((result) => app.listen(5000))
  .catch((err) => console.log(Error));

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
// use res.render to load up an ejs view file

// index page
app.get("/", function (req, res) {
  res.render("pages/index");
});

// Goes to the login page
app.get("/login", function (req, res) {
  res.render("pages/login");
});

// Goes to the G2_page
app.get("/G2_page", function (req, res) {
  res.render("pages/G2_page");
});
app.get("/G_page", async function (req, res) {
  res.render("pages/G_page");
});

// Goes to the G_page
app.post("/G_pagequery", async function (req, res) {
  // query the database engine
  // respond with template data
  var userId = req.body.user_id;
  console.log(userId);
  const data =  UserDatamodel.findOne({ userId: userId })
  .then((data) => {
    console.log(data);
    if (data) {
      console.log(data);
      res.render("pages/G_pages", { data });
        
    } else {
      console.log("User does not exist");
      res.redirect("/G2_page");
    }

  })
  .catch((err) => {
    console.log(err);
  });

  

  // console.log(req.query);
  // console.log(result);
});

app.post("/userdataupdate", function (req, res, next) {
  const userId = { userId: req.body.userId };
  const neData = { address: req.body.address, carDetails: req.body.carDetails };

  let doc = UserDatamodel.findOneAndUpdate(userId, neData);
  res.render("pages/G_page");
  console.log(doc);
});
app.post("/userdatarefinery", function (req, res, next) {
  var DOB = req.body.DOB;
  console.log(DOB);
  var UserDataItems = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userId: req.body.userId,
    DOB: DOB,
    address: req.body.address,
    carDetails: req.body.carDetails,
    LicenceNumber: req.body.licence,
  };
  var data = new UserDatamodel(UserDataItems);
  data.save();
  // next()
  res.redirect("/G_page");
});

app.listen(8000, () => {
  console.log("Server is listening on port 8080");
});
//add the router
