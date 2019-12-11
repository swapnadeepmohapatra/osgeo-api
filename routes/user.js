const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "us-cdbr-iron-east-05.cleardb.net",
  user: "b97c0a421b381a",
  password: "b07b2cef",
  database: "heroku_fc72d7c948e70b5"
});

function getConnection() {
  return pool;
}

router.get("/projects", (req, res) => {
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

    console.log(rows);
    res.json(rows);
  });
});

router.post("/project_create", (req, res) => {
  console.log("Trying to create a new projects...");

  const projectName = req.body.create_project_name;
  const projectDesc = req.body.create_project_desc;
  const projectImgLink = req.body.create_project_img_link;
  const projectLink = req.body.create_project_link;

  const queryString =
    "INSERT INTO projects (project_name, project_desc, project_img_link, project_link) VALUES (?, ?, ?, ?)";
  getConnection().query(
    queryString,
    [projectName, projectDesc, projectImgLink, projectLink],
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

module.exports = router;
