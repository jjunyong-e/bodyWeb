const express = require("express");
const bodyParser = require("body-parser");
const html = require("http");
const path = require("path");
const url = require("url");
const ejs = require("ejs");
const app = express();
const port = 3000;
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "grom0419",
  database: "bodyWebDB",
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
  response.writeHead(302, { Location: "/insertexerInfo" });
  response.end();
});

app.get("/insertexerInfo", (req, res) =>
  res.sendFile(path.join(__dirname + "/template/insertExerInfo.html"))
);
app.post("/insertexerInfo", function (request, response) {
  response.writeHead(302, { Location: "/renderingModel" });
  response.end();
});
app.get("/renderingModel", function (req, res) {
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
              const objName = rows[0].id;
              var html = `<!DOCTYPE html>
              <html lang='ko'>
                <head>
                <meta charset='UTF-8' />
                <meta http-equiv='X-UA-Compatible' content='IE=edge' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <title>male Body Changing Simulator</title>

              <!-- 기본 화면 css -->
<!--              <link rel="stylesheet" href="css/default.css" />-->
            </head>

              <body ontouchstart=''>
              <!-- 제목 -->
              <h1>신체 시뮬레이터</h1>

              <script type='module'>
                import * as THREE from "https://cdn.skypack.dev/three";
                import { OrbitControls } from "./static/js/OrbitControls";
                import { OBJLoader } from "./static/js/objloader";
                import { APP } from "./static/js/app";
                import { MeshNormalMaterial } from "./static/js/MeshNormalMaterial";
                var scene = new THREE.Scene();
                var camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.01,
                1000
                );
                camera.position.x = 0;
                camera.position.y = 80;
                camera.position.z = 240;

                var renderer = new THREE.WebGLRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setClearColor(0x000000);
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
                loader.load("/Users/junyongso/Desktop/Google Drive/obj/${objName}.obj", function (object) {
                object.traverse(function (body) {
                  if (body instanceof THREE.Mesh) {
                    body.material = material;
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
              res.writeHead(200);
              res.end(html);
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
              const objName = rows[0].id;
              var html = `
              <!DOCTYPE html>
              <html lang='ko'>
                <head>
                <meta charset='UTF-8' />
                <meta http-equiv='X-UA-Compatible' content='IE=edge' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <title>male Body Changing Simulator</title>

              <!-- 기본 화면 css -->
              <!--              <link rel="stylesheet" href="css/default.css" />-->
            </head>

              <body ontouchstart=''>
              <!-- 제목 -->
              <h1>신체 시뮬레이터</h1>
              <!-- 성별 선택 -->


              <!-- 신체 정보 및 운동정보 입력창 -->
              <div class='input'>신체정보 입력창V</div>

              <script type='module'>
                import * as THREE from "https://cdn.skypack.dev/three";
                import { OrbitControls } from "./static/js/OrbitControls";
                import { OBJLoader } from "./static/js/objloader";
                import { APP } from "./static/js/app";
                import { MeshNormalMaterial } from "./static/js/MeshNormalMaterial";
                var scene = new THREE.Scene();
                var camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.01,
                1000
                );
                camera.position.x = 0;
                camera.position.y = 80;
                camera.position.z = 240;

                var renderer = new THREE.WebGLRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setClearColor(0x000000);
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
                loader.load("/Users/junyongso/Desktop/Google Drive/obj/${objName}.obj", function (object) {
                object.traverse(function (body) {
                  if (body instanceof THREE.Mesh) {
                    body.material = material;
                    scene.add(body);
                  }
                });
                scene.add(object);
                return;
              });

                // 크기측정 함수부분

              </script>
              </body>
            </html>`;
              res.writeHead(200);
              res.end();
            }
          }
        );
      }
    }
  });
});

app.listen(port);
