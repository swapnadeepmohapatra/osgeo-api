const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const firebase = require("firebase");

var firebaseConfig = {
  apiKey: "AIzaSyATkGhtjsq4L-E311L3gqVJUNLSneru_MU",
  authDomain: "gci-osgeo.firebaseapp.com",
  databaseURL: "https://gci-osgeo.firebaseio.com",
  projectId: "gci-osgeo",
  storageBucket: "gci-osgeo.appspot.com",
  messagingSenderId: "200236554519",
  appId: "1:200236554519:web:83b7b9ee9e585cf2cbbf52"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "us-cdbr-iron-east-05.cleardb.net",
  user: "b97c0a421b381a",
  password: "b07b2cef",
  database: "heroku_fc72d7c948e70b5"
});
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: "localhost",
//   user: "root",
//   database: "osgeo_project"
// });

function getConnection() {
  return pool;
}

router.get("/projects", (req, res) => {
  requestSent();

  const connection = getConnection();
  const queryString = "SELECT * FROM projects";
  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for projects: " + err);
      res.sendStatus(500);
      return;
    }
    res.json(rows);
  });
});

router.get("/projects/:id", (req, res) => {
  console.log(req.params.id);

  requestSent();

  const connection = getConnection();

  const projectsId = req.params.id;
  const queryString = "SELECT * FROM projects WHERE id = ?";
  connection.query(queryString, [projectsId], (err, rows, fields) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      res.end();
      return;
    }

    // console.log(rows);
    res.json(rows);
  });
});

router.post("/project_create", (req, res) => {
  console.log("Trying to create a new projects...");
  requestSent();
  const projectName = req.body.create_project_name;
  const projectDesc = req.body.create_project_desc;
  const projectImgLink = req.body.create_project_img_link;
  const projectLink = req.body.create_project_link;
  const projectType = req.body.create_project_type;

  const queryString =
    "INSERT INTO projects (name, tagLine, imageUrl, url, type) VALUES (?, ?, ?, ?, ?)";
  getConnection().query(
    queryString,
    [projectName, projectDesc, projectImgLink, projectLink, projectType],
    (err, results, fields) => {
      if (err) {
        console.log("Failed to insert new project: " + err);
        res.sendStatus(500);
        return;
      }

      console.log("Inserted a new project with id: ", results.insertId);
      res.end();
    }
  );
});

function requestSent() {
  console.log("Request Sent");

  firebase
    .database()
    .ref()
    .child("stats")
    .push("now");
}

module.exports = router;
