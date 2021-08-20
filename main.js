const express = require("express");
const bodyParser = require("body-parser");
const html = require("http");
const path = require("path");
const url = require("url");
const ejs = require("ejs");
const app = express();
const port = 3000;
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "grom0419",
  database: "BodyWebDB",
});
db.connect();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "template/insertBodyInfo.html"))
);
app.post("/insertBodyinfo", function (request, response) {
  // console.log(request);
  let insertSql =
      "INSERT INTO userBodyData (gender,age,height,weight,inseam,armLength,shoulderLength,chestCirc,waistCirc,hipCirc,thighCirc,armCirc,calfCirc,headWidth) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  var post = request.body;
  var gender_ = post.gender;
  var age_ = post.age;
  var height_ = post.height;
  var weight_ = post.weight;
  var inseam_ = post.inseam;
  var armLength_ = post.armLength;
  var shoulderLength_ = post.shoulderLength;
  var chestCirc_ = post.chestCirc;
  var waistCirc_ = post.waistCirc;
  var hipCirc_ = post.hipCirc;
  var thighCirc_ = post.thighCirc;
  var armCirc_ = post.armCirc;
  var calfCirc_ = post.calfCirc;
  var headWidth_ = post.headWidth;
  db.query(
      insertSql,
      [
        gender_,
        age_,
        height_,
        weight_,
        inseam_,
        armLength_,
        shoulderLength_,
        chestCirc_,
        waistCirc_,
        hipCirc_,
        thighCirc_,
        armCirc_,
        calfCirc_,
        headWidth_,
      ],
      function (error, result) {
        if (error) {
          console.error("error : ", error);
        }
      }
  );
  response.writeHead(302, {Location: "/insertexerInfo"});
  response.end();
});

app.get("/insertexerInfo", (req, res) =>
    res.sendFile(path.join(__dirname + "/template/insertExerInfo.html"))
);
app.post("/insertexerInfo", function (request, response) {
  db.query("SELECT * FROM userBodyData", function (err, rows, fields) {
    if (err) {
      throw err;
    } else {
      var gender_ = rows[0].gender;
      var age_ = rows[0].age;
      var height_ = rows[0].height;
      var weight_ = rows[0].weight;
      var inseam_ = rows[0].inseam;
      var armLength_ = rows[0].armLength;
      var shoulderLength_ = rows[0].shoulderLength;
      var chestCirc_ = rows[0].chestCirc;
      var waistCirc_ = rows[0].waistCirc;
      var hipCirc_ = rows[0].hipCirc;
      var thighCirc_ = rows[0].thighCirc;
      var armCirc_ = rows[0].armCirc;
      var calfCirc_ = rows[0].calfCirc;
      var headWidth_ = rows[0].headWidth;
      if (gender_ === "male") {
        var selectModelSql =
            "SELECT id FROM maleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)";
        db.query(
            selectModelSql,
            [
              age_,
              height_,
              weight_,
              inseam_,
              armLength_,
              shoulderLength_,
              chestCirc_,
              waistCirc_,
              hipCirc_,
              thighCirc_,
              armCirc_,
              calfCirc_,
              headWidth_,
            ],
            function (err, rows, fields) {
              if (err) {
                console.error("error : ", err);
              } else {
                const filename = rows[0].id;
                var insertfilename = "INSERT INTO objName(filename) VALUES(?)";
                db.query(insertfilename, [filename + ".obj"],
                    function (error, result) {
                      if (error) {
                        console.error("error : ", error);
                      }
                    }
                )
                ;
              }
            }
        );
      } else {
        var selectModelSql =
            "SELECT id FROM femaleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)";
        db.query(
            selectModelSql,
            [
              age_,
              height_,
              weight_,
              inseam_,
              armLength_,
              shoulderLength_,
              chestCirc_,
              waistCirc_,
              hipCirc_,
              thighCirc_,
              armCirc_,
              calfCirc_,
              headWidth_,
            ],
            function (err, rows, fields) {
              if (err) {
                console.error("error : ", err);
              } else {
                const filename = rows[0].id;
                var insertfilename = "INSERT INTO objName (filename) VALUES (?)";
                db.query(insertfilename, [filename + ".obj"],
                    function (error, result) {
                      if (error) {
                        console.error("error : ", error);
                      }
                    });
              }
            }
        );
      }
    }
  });
  // response.writeHead(200);
  response.writeHead(302, {Location: "/renderingModel"});
  response.end();
});

app.get("/renderingModel", function (req, res) {
  res.sendFile(path.join(__dirname + "/template/renderingModel.html"));
});
//   db.query("SELECT * FROM userBodyData", function (err, rows, fields) {
//     if (err) {
//       throw err;
//     } else {
//       var gender_ = rows[0].gender;
//       var age_ = rows[0].age;
//       var height_ = rows[0].height;
//       var weight_ = rows[0].weight;
//       var inseam_ = rows[0].inseam;
//       var armLength_ = rows[0].armLength;
//       var shoulderLength_ = rows[0].shoulderLength;
//       var chestCirc_ = rows[0].chestCirc;
//       var waistCirc_ = rows[0].waistCirc;
//       var hipCirc_ = rows[0].hipCirc;
//       var thighCirc_ = rows[0].thighCirc;
//       var armCirc_ = rows[0].armCirc;
//       var calfCirc_ = rows[0].calfCirc;
//       var headWidth_ = rows[0].headWidth;
//       if (gender_ === "male") {
//         var selectModelSql =
//             "SELECT id FROM maleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)";
//         db.query(
//             selectModelSql,
//             [
//               age_,
//               height_,
//               weight_,
//               inseam_,
//               armLength_,
//               shoulderLength_,
//               chestCirc_,
//               waistCirc_,
//               hipCirc_,
//               thighCirc_,
//               armCirc_,
//               calfCirc_,
//               headWidth_,
//             ],
//             function (err, rows, fields) {
//               if (err) {
//                 console.error("error : ", err);
//               } else {
//                 const filename = rows[0].id;
//                 db.query(`INSERT INTO objName (filename)
//                           VALUES (?)`, [filename + ".obj"],
//                     function (error, result) {
//                       if (error) {
//                         throw error;
//                       }
//                     });
//
//                 res.writeHead(200);
//                 res.end();
//               }
//             }
//         );
//       } else {
//         var selectModelSql =
//             "SELECT id FROM femaleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)";
//         db.query(
//             selectModelSql,
//             [
//               age_,
//               height_,
//               weight_,
//               inseam_,
//               armLength_,
//               shoulderLength_,
//               chestCirc_,
//               waistCirc_,
//               hipCirc_,
//               thighCirc_,
//               armCirc_,
//               calfCirc_,
//               headWidth_,
//             ],
//             function (err, rows, fields) {
//               if (err) {
//                 console.error("error : ", err);
//               } else {
//                 const filename = rows[0].id;
//                 db.query(`INSERT INTO objName (filename)
//                           VALUES (?)`, [filename + ".obj"],
//                     function (error, result) {
//                       if (error) {
//                         throw error;
//                       }
//                     });
//
//                 res.writeHead(200);
//                 res.end();
//               }
//             }
//         );
//       }
//     }
//   });
// });
app.listen(port);
