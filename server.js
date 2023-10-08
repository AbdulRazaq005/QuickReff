import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import mongoose from "mongoose";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
connectDB();

var menuSchema = new mongoose.Schema({
  menu: Object,
});
const Menu = mongoose.model("menu", menuSchema);

var dataSchema = new mongoose.Schema({
  catagory: String,
  subHeading: {
    type: String,
    required: true,
    unique: true,
  },
  links: Array,
  desc: String,
  subContent: Array,
  filter: String,
});

const DataBlock = mongoose.model("DataBlock", dataSchema);

// app.get("/", (req, res) => {
//   res.sendFile("./build/index.html");
// });

app.get("/api/:catagory", (req, res) => {
  // console.log("Params...", req.params);
  DataBlock.find(req.params, (err, data) => {
    if (err) {
      // console.log("Error Fetching Menu from DB...");
      res.status(400).send(400);
    } else {
      // console.log("got data from DB...");
      res.json(data);
    }
  });
});

app.post("/api/:catagory", (req, res) => {
  // console.log("got data from frontend...", req.body);
  const maindata = new DataBlock(req.body);
  maindata.save((err, data) => {
    if (err) {
      // console.log("Error inserting single data in DB...");
      res.status(400).send(400);
    } else {
      // console.log("Data inserted : ", data);
      res.status(200).send();
      // res.send(200);
    }
  });
});

app.delete("/api/:id", (req, res) => {
  // console.log("deleted data from DB", req.params.subHeading, "---------------");
  DataBlock.findById(req.params.id, function (error, data) {
    data.remove(function (error) {
      if (error) {
        // console.log(error);
        res.status(400).send();
      } else {
        res.status(200).send();
      }
    });
  });
});

app.put("/api/:id", (req, res) => {
  // console.log("deleted data from DB", req.body, "---------------");
  DataBlock.replaceOne(
    { _id: req.params.id },
    req.body,
    function (error, data) {
      // console.log(data);
      if (error) {
        // console.log(error);
        res.status(400).send();
      } else {
        res.status(200).send();
      }
    }
  );
});

//Modify Menu HERE!!!

// const mainmenu = new Menu(menu);
// mainmenu.save((err, data) => {
//   if (err) {
//     console.log("Error inserting Menu...");
//   } else {
//     console.log("Menu inserted : ", data);
//   }
// });

app.get("/menu", (req, res) => {
  Menu.findOne({}, (err, data) => {
    if (err) {
      // console.log("Error Fetching Menu from DB...");
    } else {
      // console.log("got MENU from backend...");
      res.json(data);
    }
  });
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/dist")));

  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
  app.get("*", (req, res) => {
    res.redirect("/");
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("frontend/build"));
// }

const PORT = process.env.PORT || 5001;
// const PORT = 5000;
app.listen(
  PORT
  // console.log(`Backend Server is up on PORT ${PORT}...`)
);
