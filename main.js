var express = require("express");
var app = express();
var router = express.Router();
var fs = require("fs");
var mysql = require("mysql2");
var static = require('serve-static');
var bodyParser = require("body-parser");
var chokidar = require("chokidar");
var path = require('path');
//터미널 실행
var spawn = require("child_process").spawn;
var exec = require('child_process').exec;
//upload 모듈
var multer = require('multer');
const serveStatic = require("serve-static");
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
app.get('/insertInfo', function (req, res) {
  res.render('insertInfo')
})

//db키입력
app.post('/insertInfo', function (req, res) {
  var post = req.body;
  var age_ = post.age;
  var height_ = post.height;
  var gender_ = post.gender;
  var weight_ = post.weight;

  var insertsql = "INSERT INTO userInfo (age,height,weight,gender) VALUES(?,?,?,?)"
  db.query(insertsql, [age_,height_,weight_,gender_], function (err, res, fields) {
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
    db.query("SELECT * FROM userInfo",
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
      console.log(height_)
      var option = {
        shell: '/bin/zsh',
        windowshide: true
      }

      var command =
          `conda run -n bodyweb python3 calc.py -i sample_data/input/shin.jpg -ht ${height_}`
      console.log(command)
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
  var watcher = chokidar.watch('measure.json', {
    persistent: true
  });
  watcher.on('add', path => {
  const dataBuffer = fs.readFileSync("measure.json");
  const dataJson = dataBuffer.toString()
  const data = JSON.parse(dataJson)
  db.query("SELECT * FROM userInfo",function(err,res){
    var age_ = res[0].age
    var height_ = res[0].height
    var weight_ = res[0].weight
    var gender_ = res[0].gender
    var chestCirc_ = data.chest
    var waistCirc_ = data.waist
    var bellyCirc_ = data.belly
    var wristCirc_ = data.wrist
    var neckCirc_ = data.neck
    var armLength_ = data.ArmLength
    var thighCirc_ = data.Thigh
    var hipsCirc_ = data.Hips
    var shoulderWidth_ = data.shoulderWidth
    db.query("INSERT INTO userBodyData (age,gender,height,weight,bellyCirc,waistCirc,chestCirc,wristCirc,neckCirc,armLength,shoulderWidth,thighCirc,hipCirc) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)"
        ,[age_,gender_,height_,weight_,bellyCirc_,waistCirc_,chestCirc_,wristCirc_,neckCirc_,armLength_,thighCirc_,hipsCirc_,shoulderWidth_],function (err2,res2) {
      if(err2){
        throw err2;
        }})

})
    res.writeHead(302,{Location : "/finding"})
    res.end()
  });
})

//finding
app.get("/finding",function(err,res){

  var result = [];

  var getinfo = function (callback) {
    db.query("SELECT * FROM userBodyData",
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
  getinfo(function(err2,res2){
    var gender_ = res2[0].gender;
    var age_ = Math.floor(res2[0].age/10)*10;
    height_ = res2[0].height;
    var weight_  = res2[0].weight;
    var bellyCirc_ = res2[0].bellyCirc;
    var waistCirc_ = res2[0].waistCirc;
    var chestCirc_ = res2[0].chestCirc;
    var wristCirc_ = res2[0].wristCirc;
    var armLength_ = res2[0].armLength;
    var shoulderWidth_ = res2[0].shoulderWidth;
    var thighCirc_ = res2[0].thighCirc;
    var hipsCirc_ = res2[0].hipsCirc;
    var neckCirc_ = res2[0].neckCirc;

    var maleModels = [];

    var getMaleModel = function (callback) {
      db.query("SELECT * FROM maleData WHERE (age = ?) order by(abs(height - ?) + abs(weight - ?) +  abs(waistCirc - ?) +  abs(armLength - ?)"
          + "+ abs(neckCirc - ?) + abs(chestCirc - ?) + abs(shoulderWidth - ?) + abs(thighCirc - ?) + abs(hipCirc - ?))"
          ,[age_,height_,weight_,waistCirc_,neckCirc_, chestCirc_,armLength_,shoulderWidth_,thighCirc_,hipsCirc_],
          function (err, res, fields) {
            if (err) {
              return callback(err);
            }
            if (res.length) {
              for (var i = 0; i < res.length; i++) {
                maleModels.push(res[i]);
              }
            }
            callback(null, maleModels);
          });
    };
    if (gender_ === "male"){
     getMaleModel(function(err3,res3){
      if (err3) {
        throw err3;
      } else{
          db.query("insert into objName values (?,?)",["/"+res3[0].id+".obj","/"+res3[0].type+".obj"],function(err4,res4){
          if (err4){
          throw err4;
          }
        })
      }
     })

    } else{
      var femaleModels = [];
      var getFemaleModel = function (callback) {
        db.query("SELECT * FROM femaleData WHERE (age = ?) order by(abs(height - ?) + abs(weight - ?) +  abs(waistCirc - ?) +  abs(armLength - ?)"
            + "+ abs(neckCirc - ?) + abs(chestCirc - ?) + abs(shoulderWidth - ?) + abs(thighCirc - ?) + abs(hipCirc - ?))"
            ,[age_,height_,weight_,waistCirc_,neckCirc_, chestCirc_,armLength_,shoulderWidth_,thighCirc_,hipsCirc_],
            function (err, res, fields) {
              if (err) {
                return callback(err);
              }
              if (res.length) {
                for (var i = 0; i < res.length; i++) {
                  femaleModels.push(res[i]);
                }
              }
              callback(null, femaleModels);
            });
      };

      getFemaleModel(function(err3,res3){
        if (err3){
          throw err3;
        } else{
          db.query("insert into objName values (?,?)",["/"+res3[0].id+"E.obj","/"+res3[0].type+".obj"],function(err4,res4){
            if (err4){
              throw err4;
            }
          })
        }
      })
    }
  })
  res.writeHead(302,{Location:"/comparison"})
  res.end()

})
//comparison
app.use(static(path.join(__dirname+ '/models/obj')));
app.get("/comparison",function(err,res){
  res.render("comparison",
      // {ref: '/20avgf.obj'}
  )

})
//rendering추가

//연결
var port = 3400;
app.listen(port, function () {
  var dir = "sample_data/input/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  console.log("server on! http://localhost:" + port);
});