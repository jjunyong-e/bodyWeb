const express = require("express");
const bodyParser = require("body-parser");
const html = require("http");
const path = require("path");
const url = require("url");
const ejs = require("ejs");
const app = express();
const port = 5500;
const mysql = require("mysql2");
const static = require('serve-static');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "grom0419",
  database: "BodyWebDB",
  multipleStatements: true
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

  response.writeHead(302, {Location: "/insertExerInfo"});
  response.end();
});

// app.get("/insertExerInfo", function (req, res, next) {
//   // res.sendFile(path.join(__dirname + "/template/insertExerInfo.html"))
//   var result = [];
//   console.log(result)
//   var getinfo = function (callback) {
//     db.query("SELECT * FROM userBodyData", function (err, res, fields) {
//       if (err) {
//         return callback(err);
//       }
//       if (res.length) {
//         for (var i = 0; i < res.length; i++) {
//           result.push(res[i]);
//         }
//       }
//       callback(null, result);
//     });
//   };
//   console.log("callfunction")
//   getinfo(function (err, result) {
//     if (err) {
//       console.log("err")
//     } else {
//       console.log(result)
//     }
//
//   })
//
//   if (gender_ == "male") {
//     console.log(gender_)
//     var selectInsertModelSql =
//         "INSERT INTO objName(filename) SELECT maleData.id  FROM maleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)";
//     db.query(
//         selectInsertMModelSql,
//         [
//           age_,
//           height_,
//           weight_,
//           inseam_,
//           armLength_,
//           shoulderLength_,
//           chestCirc_,
//           waistCirc_,
//           hipCirc_,
//           thighCirc_,
//           armCirc_,
//           calfCirc_,
//           headWidth_,
//         ], function (err, result) {
//           if (!err) {
//             console.log(result)
//           }
//         })
//   } else {
//     var selectInsertFModelSql =
//         "INSERT INTO objName(filename) SELECT femaleData.id FROM femaleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)"
//     db.query(
//         selectInsertFModelSql,
//         [
//           age_,
//           height_,
//           weight_,
//           inseam_,
//           armLength_,
//           shoulderLength_,
//           chestCirc_,
//           waistCirc_,
//           hipCirc_,
//           thighCirc_,
//           armCirc_,
//           calfCirc_,
//           headWidth_,
//         ], function (err, result) {
//           if (!err) {
//             console.log(result)
//           }
//         });
//   }
//   response.writeHead(302, {Location: "/renderingModel"});
//   response.end();
// });
app.get("/insertexerInfo", function (request, response) {
  var result = [];
  console.log(result)
  var getinfo = function (callback) {
    db.query("SELECT * FROM userBodyData", function (err, res, fields) {
      if (err) {
        return callback(err);
      }
      if (res.length) {
        for (var i = 0; i < res.length; i++) {
          result.push(res[i]);
        }
      }
      callback(null, result);
    });
  };
  console.log("callfunction")
  getinfo(function (err, result) {
    if (err) {
      console.log("err")
    } else {
      var gender_ = result[0].gender
      console.log(result[0].gender)
      if (result[0].gender == "male") {
        // var selectInsertModelSql =
        //     "INSERT INTO objName(filename) SELECT maleData.id  FROM maleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)";
        db.query(
            "INSERT INTO objName(filename) SELECT maleData.id  FROM maleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)"
            ,
            [
              result[0].age,
              result[0].height,
              result[0].weight,
              result[0].inseam,
              result[0].armLength,
              result[0].shoulderLength,
              result[0].chestCirc,
              result[0].waistCirc,
              result[0].hipCirc,
              result[0].thighCirc,
              result[0].armCirc,
              result[0].calfCirc,
              result[0].headWidth,
            ],
            function (err, result) {
              if (!err) {
                console.log(result)
              } else {
                console.error(err)
              }
            });
      } else {
        // var selectInsertFModelSql =
        //     "INSERT INTO objName(filename) SELECT femaleData.id FROM femaleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)"
        db.query(
            "INSERT INTO objName(filename) SELECT femaleData.id FROM femaleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)",
            [
              result[0].age,
              result[0].height,
              result[0].weight,
              result[0].inseam,
              result[0].armLength,
              result[0].shoulderLength,
              result[0].chestCirc,
              result[0].waistCirc,
              result[0].hipCirc,
              result[0].thighCirc,
              result[0].armCirc,
              result[0].calfCirc,
              result[0].headWidth,
            ], function (err, result) {
              if (!err) {
                console.log(result)
              } else {
                console.error(err)
              }
            });
      }
    }
  })

  response.writeHead(302, {Location: "/renderingModel"});
  response.end();
})

app.use(static(path.join(__dirname, 'model/obj')));
app.get("/renderingModel", function (req, res) {
  res.sendFile(path.join(__dirname + "/template/renderingModel.html"));
});

app.listen(port);

