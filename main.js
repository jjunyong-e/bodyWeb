const express = require("express");
const bodyParser = require("body-parser");
const html = require("http");
const path = require("path");
const url = require("url");
const ejs = require("ejs");
const app = express();
const port = 3300;
const mysql = require("mysql2");
const static = require("serve-static");

const db = mysql.createConnection({
  host: "bodywebdb.cnrtoyi1tcyy.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "grom0419",
  database: "BodyWebDB",
  multipleStatements: true,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
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

  response.writeHead(302, { Location: "/insertExerInfo" });
  response.end();
});
app.get("/insertexerInfo", function (request, response) {
  var result = [];
  console.log(result);
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
  console.log("callfunction");
  getinfo(function (err, result) {
    if (err) {
      console.log("err");
    } else {
      var gender_ = result[0].gender;
      console.log(result[0].gender);
      if (result[0].gender == "male") {
        // var selectInsertModelSql =
        //     "INSERT INTO objName(filename) SELECT maleData.id  FROM maleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)";
        db.query(
          "INSERT INTO objName(filename) SELECT maleData.id  FROM maleData WHERE (age = ? and height = ? and weight = ? and inseam = ? and armLength = ? and shoulderLength = ? and chestCirc = ? and waistCirc = ? and hipCirc = ? and thighCirc = ? and armCirc = ? and calfCirc = ? and headWidth = ?)",
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
              // console.log(result);
            } else {
              console.error(err);
            }
          }
        );
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
          ],
          function (err, result) {
            if (!err) {
              console.log(result);
            } else {
              console.error(err);
            }
          }
        );
      }
    }
  });

  response.writeHead(302, { Location: "/renderingModel" });
  response.end();
});

app.use(static(path.join(__dirname, "model/obj")));
app.get("/renderingModel", function (request, response) {
  var filename = [];
  var getInformationFromDB = function (callback) {
    db.query("SELECT filename FROM objName", function (err, res, fields) {
      if (err) return callback(err);
      if (res.length) {
        for (var i = 0; i < res.length; i++) {
          filename.push(res[i]);
        }
      }
      callback(null, filename);
    });
  };

  getInformationFromDB(function (err, result) {
    if (err) {
      console.error(err);
    } else {
      console.log(filename);
      console.log(filename[0].filename);
      var html = `
        <!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Female Body Changing Simulator</title>
</head>

<body ontouchstart="">
<!-- 제목 -->
<h1>신체 시뮬레이터</h1>
<!-- 성별 선택 -->

<!-- 신체 정보 및 운동정보 입력창 -->

<script type="module">
  import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.122.0/build/three.module.js";
  import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/controls/OrbitControls.js";
  import {OBJLoader} from "https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/loaders/OBJLoader.js";
  // import {APP} from "../js/app.js";
  import {MeshNormalMaterial} from "https://cdn.jsdelivr.net/npm/three@0.122.0/src/materials/MeshNormalMaterial.js";

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, 1 / 2, 1, 5000);
  camera.position.x = 0;
  camera.position.y = 2200;
  camera.position.z = -1600;

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth / 2, window.innerHeight);
  renderer.setClearColor(0xffffff);
  renderer.border;
  document.body.appendChild(renderer.domElement);

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  animate();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  var loader = new OBJLoader();
  var material = new MeshNormalMaterial();
  // loader.setMaterials(material);
  var object;
  var body;

  console.log(name)
  loader.load("/"+${filename[0].filename}+".obj",
      function (object) {
        object.traverse(function (body) {
          if (body instanceof THREE.Mesh) {
            body.material = material;
            body.rotation.x = (Math.PI / 360) * -100;
            scene.add(body);
          }
        });

        scene.add(object);
        return;
      });

  // 크기측정 함수부분
</script>
</body>
</html>
        `;
    }
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(html);
  });
});

// app.get("/renderingModel", function (req, res) {
//   res.sendFile(path.join(__dirname + "/template/renderingModel.html"));
// });

app.listen(port);
