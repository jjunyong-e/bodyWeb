var express = require("express");
var app = express();
var router = express.Router();
var fs = require("fs");
var mysql = require("mysql2");
var static = require('serve-static');
var bodyParser = require("body-parser");

//터미널 실행
var spawn = require("child_process").spawn;
var exec = require('child_process').exec;
//upload 모듈
var multer = require('multer');
var upload = multer({dest: "sample_data/input/"});

//db연결
var db = mysql.createConnection({
  host: "bodywebdb.cnrtoyi1tcyy.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "grom0419",
  database: "BodyWebDB",
  multipleStatements: true
});
db.connect();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//배경사진 업로드
app.get("/", function (req, res) {
  res.render("uploadBackground");
  res.end();
});

// 사람사진 업로드
app.get("/uploadHuman", function (req, res) {
  res.render("uploadHuman");
});

//키입력
app.get('/insertHeight', function (req, res) {
  res.render('insertHeight')
})

//db키입력
app.post('/insertHeight', function (req, res) {
  var post = req.body;
  var height_ = post.height;
  console.log(height_)
  var insertsql = "INSERT INTO userHeight (height) VALUES(?)"
  db.query(insertsql, [height_], function (err, res, fields) {
    if (err) {
      console.error(err);
    }
  })
  res.writeHead(302, {Location: '/measurements'})
  res.end()
})

// 신체치수 계산
app.get('/measurements', function (req, res) {
  var result = [];
  console.log(result)
  var getinfo = function (callback) {
    db.query("SELECT * FROM userHeight",
        function (err, res, fields) {
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
      console.error(err);
    } else {
      var height_ = result[0].height
      var option = {
        shell: '/bin/zsh',
        windowshide: true
      }

      var command =
          `conda run -n bodyweb python3 calc.py -i sample_data/input/so.jpg -ht ${height_}`

      exec(command,
          function (error, stdout, stderr) {
            console.log(error)
            console.log(stdout)
            console.log(stderr)
          }
      )
      ;
    }
  })
  console.log('완료')
})

// 운동 입력

//연결
var port = 3400;
app.listen(port, function () {
  var dir = "sample_data/input/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  console.log("server on! http://localhost:" + port);
});