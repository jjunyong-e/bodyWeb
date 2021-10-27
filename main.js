var express = require("express");
var app = express();
var router = express.Router();
var fs = require("fs");
var mysql = require("mysql2");
var static = require("serve-static");
var bodyParser = require("body-parser");
var chokidar = require("chokidar");
var path = require("path");
//터미널 실행
var spawn = require("child_process").spawn;
var exec = require("child_process").exec;
//upload 모듈
var multer = require("multer");
const serveStatic = require("serve-static");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./sample_data/input");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

var upload = multer({ storage: storage }).single("attachments");

//db연결


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//배경사진 업로드
app.get("/", function (req, res) {
  res.render("uploadBackground");
});
app.post("/uploadBackground", async (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      var FileName = req.file.filename;
      res.status(200).send(FileName);
    }
  });
  res.writeHead(302, { Location: "/uploadHuman" });
  res.end();
});
// 사람사진 업로드
app.get("/uploadHuman", function (req, res) {
  res.render("uploadHuman");
});
app.post("/uploadHuman", async (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      var FileName = req.file.filename;
      res.status(200).send(FileName);
    }
  });
  res.writeHead(302, { Location: "/insertInfo" });
  res.end();
});
//키입력
app.get("/insertInfo", function (req, res) {
  res.render("insertInfo");
});

//db키입력
app.post("/insertInfo", function (req, res) {
  var post = req.body;
  var age_ = post.age;
  var height_ = post.height;
  var gender_ = post.gender;
  var weight_ = post.weight;

  var insertsql =
    "INSERT INTO userInfo (age,height,weight,gender) VALUES(?,?,?,?)";
  db.query(
    insertsql,
    [age_, height_, weight_, gender_],
    function (err, res, fields) {
      if (err) {
        console.error(err);
      }
    }
  );
  res.writeHead(302, { Location: "/measurements" });
  res.end();
});

// 신체치수 계산
app.get("/measurements", function (req, res) {
  var result = [];
  console.log(result);
  var getinfo = function (callback) {
    db.query("SELECT * FROM userInfo", function (err, res, fields) {
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
      console.error(err);
    } else {
      var length_ = result.length - 1;
      var height_ = result[length_].height;
      console.log(height_);
      var option = {
        shell: "/bin/zsh",
        windowshide: true,
      };

      var command = `conda run -n bodyweb python3 calc.py -i sample_data/input/shin.jpg -ht ${height_}`;
      console.log(command);
      exec(command, function (error, stdout, stderr) {
        console.log(error);
        console.log(stdout);
        console.log(stderr);
      });
    }
  });
  var watcher = chokidar.watch("measure.json", {
    persistent: true,
  });
  watcher.on("add", (path) => {
    const dataBuffer = fs.readFileSync("measure.json");
    const dataJson = dataBuffer.toString();
    const data = JSON.parse(dataJson);
    db.query("SELECT * FROM userInfo", function (err, res) {
      var length_ = res.length - 1;
      var age_ = res[length_].age;
      var height_ = res[length_].height;
      var weight_ = res[length_].weight;
      var gender_ = res[length_].gender;
      var chestCirc_ = data.chest;
      var waistCirc_ = data.waist;
      var bellyCirc_ = data.belly;
      var wristCirc_ = data.wrist;
      var neckCirc_ = data.neck;
      var armLength_ = data.ArmLength;
      var thighCirc_ = data.Thigh;
      var hipsCirc_ = data.Hips;
      var shoulderWidth_ = data.shoulderWidth;
      db.query(
        "INSERT INTO userBodyData (age,gender,height,weight,bellyCirc,waistCirc,chestCirc,wristCirc,neckCirc,armLength,shoulderWidth,thighCirc,hipCirc) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          age_,
          gender_,
          height_,
          weight_,
          bellyCirc_,
          waistCirc_,
          chestCirc_,
          wristCirc_,
          neckCirc_,
          armLength_,
          thighCirc_,
          hipsCirc_,
          shoulderWidth_,
        ],
        function (err2, res2) {
          if (err2) {
            throw err2;
          }
        }
      );
    });
    res.writeHead(302, { Location: "/finding" });
    res.end();
  });
});

//finding
app.get("/finding", function (err, res) {
  var result = [];

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
  getinfo(function (err2, res2) {
    var length_ = res2.length - 1;
    var gender_ = res2[length_].gender;
    var age_ = Math.floor(res2[length_].age / 10) * 10;
    var height_ = res2[length_].height;
    var weight_ = res2[length_].weight;
    var bellyCirc_ = res2[length_].bellyCirc;
    var waistCirc_ = res2[length_].waistCirc;
    var chestCirc_ = res2[length_].chestCirc;
    var wristCirc_ = res2[length_].wristCirc;
    var armLength_ = res2[length_].armLength;
    var shoulderWidth_ = res2[length_].shoulderWidth;
    var thighCirc_ = res2[length_].thighCirc;
    var hipsCirc_ = res2[length_].hipsCirc;
    var neckCirc_ = res2[length_].neckCirc;

    var maleModels = [];

    var getMaleModel = function (callback) {
      db.query(
        "SELECT * FROM maleData WHERE (age = ?) order by(abs(height - ?) + abs(weight - ?) +  abs(waistCirc - ?) +  abs(armLength - ?)" +
          "+ abs(neckCirc - ?) + abs(chestCirc - ?) + abs(shoulderWidth - ?) + abs(thighCirc - ?) + abs(hipCirc - ?))",
        [
          age_,
          height_,
          weight_,
          waistCirc_,
          neckCirc_,
          chestCirc_,
          armLength_,
          shoulderWidth_,
          thighCirc_,
          hipsCirc_,
        ],
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
        }
      );
    };
    if (gender_ === "male") {
      getMaleModel(function (err3, res3) {
        if (err3) {
          throw err3;
        } else {
          var length_ = res3.length - 1;
          db.query(
            "insert into objName values (?,?)",
            [
              "/" + res3[length_].id + ".obj",
              "/" + res3[length_].type + ".obj",
            ],
            function (err4, res4) {
              if (err4) {
                throw err4;
              }
            }
          );
        }
      });
    } else {
      var femaleModels = [];
      var getFemaleModel = function (callback) {
        db.query(
          "SELECT * FROM femaleData WHERE (age = ?) order by(abs(height - ?) + abs(weight - ?) +  abs(waistCirc - ?) +  abs(armLength - ?)" +
            "+ abs(neckCirc - ?) + abs(chestCirc - ?) + abs(shoulderWidth - ?) + abs(thighCirc - ?) + abs(hipCirc - ?))",
          [
            age_,
            height_,
            weight_,
            waistCirc_,
            neckCirc_,
            chestCirc_,
            armLength_,
            shoulderWidth_,
            thighCirc_,
            hipsCirc_,
          ],
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
          }
        );
      };

      getFemaleModel(function (err3, res3) {
        if (err3) {
          throw err3;
        } else {
          var length_ = re3.length - 1;
          db.query(
            "insert into objName values (?,?)",
            [
              "/" + res3[length_].id + "E.obj",
              "/" + res3[length_].type + ".obj",
            ],
            function (err4, res4) {
              if (err4) {
                throw err4;
              }
            }
          );
        }
      });
    }
  });
  res.writeHead(302, { Location: "/comparison" });
  res.end();
});
//comparison
app.use(static(path.join(__dirname + "/models/obj")));
app.get("/comparison", function (err, res) {
  var results = [];

  var getinfo = function (callback) {
    db.query("SELECT * FROM objName", function (err, res, fields) {
      if (err) {
        return callback(err);
      }
      if (res.length) {
        for (var i = 0; i < res.length; i++) {
          results.push(res[i]);
        }
      }
      callback(null, results);
    });
  };

  getinfo(function (err2, res2) {
    var length_ = res2.length - 1;
    var objName_ = res2[length_].fileName;
    var typeName_ = res2[length_].typeName;
    res.render("comparison", { typeName: typeName_, objName: objName_ });
    res.end();
  });
});

//rendering추가

app.get("/change", function (err, res) {
  var origins = [];

  var getOrigins = function (callback) {
    db.query("SELECT * FROM userBodyData", function (err, res, fields) {
      if (err) {
        return callback(err);
      }
      if (res.length) {
        for (var i = 0; i < res.length; i++) {
          origins.push(res[i]);
        }
      }
      callback(null, origins);
    });
  };
  getOrigins(function (err2, res2) {
    var length_ = res2.length - 1;
    var gender_ = res2[length_].gender;
    var originAge_ = Math.floor(res2[length_].age / 10) * 10;
    var originHeight_ = res2[length_].height;
    var originWeight_ = res2[length_].weight;
    var originWaistCirc_ = res2[length_].waistCirc;
    var originChestCirc_ = res2[length_].chestCirc;
    var originShoulderWidth_ = res2[length_].shoulderWidth;
    var originThighCirc_ = res2[length_].thighCirc;
    var originHipsCirc_ = res2[length_].hipCirc;
    var originNeckCirc_ = res2[length_].neckCirc;
    var models0 = [];

    var getModels0 = function (callback) {
      db.query(
        `SELECT id FROM maleData order by(abs(weight - ${originWeight_}) +  abs(waistCirc - ${originWaistCirc_})  + abs(neckCirc - ${originNeckCirc_}) + abs(chestCirc - 1.015 * ${originChestCirc_}) + abs(shoulderWidth - ${originShoulderWidth_}) + abs(thighCirc - 0.99*${originThighCirc_}) + abs(hipCirc - 0.977*${originHipsCirc_})`,
        function (err, res, fields) {
          if (err) {
            return callback(err);
          }
          if (res.length) {
            for (var i = 0; i < 1; i++) {
              models0.push(res[i]);
            }
          }
          callback(null, models0);
        }
      );
    };
    var models1 = [];

    var getModels1 = function (callback) {
      db.query(
        `SELECT id FROM maleData order by(abs(weight - ${originWeight_}) +  abs(waistCirc - ${originWaistCirc_})  + abs(neckCirc - ${originNeckCirc_}) + abs(chestCirc - 1.022 * ${originChestCirc_}) + abs(shoulderWidth - ${originShoulderWidth_}) + abs(thighCirc - 0.987*${originThighCirc_}) + abs(hipCirc - 0.977*${originHipsCirc_}))`,
        function (err, res, fields) {
          if (err) {
            return callback(err);
          }
          if (res.length) {
            for (var i = 1; i < 2; i++) {
              models1.push(res[i]);
            }
          }
          callback(null, models1);
        }
      );
    };
    var models2 = [];

    var getModels2 = function (callback) {
      db.query(
        `SELECT id FROM maleData order by(abs(weight - 1.02*${originWeight_}) +  abs(waistCirc - ${originWaistCirc_})  + abs(neckCirc - ${originNeckCirc_}) + abs(chestCirc - ${originChestCirc_}) + abs(shoulderWidth - ${originShoulderWidth_}) + abs(thighCirc - 1.029*${originThighCirc_}) + abs(hipCirc - ${originHipsCirc_}))`,
        function (err, res, fields) {
          if (err) {
            return callback(err);
          }
          if (res.length) {
            for (var i = 2; i < 3; i++) {
              models2.push(res[i]);
            }
          }
          callback(null, models2);
        }
      );
    };
    var models3 = [];

    var getModels3 = function (callback) {
      db.query(
        `SELECT id FROM maleData order by(abs(weight - 1.026* ${originWeight_}) +  abs(waistCirc - ${originWaistCirc_})  + abs(neckCirc - ${originNeckCirc_}) + abs(chestCirc - ${originChestCirc_}) + abs(shoulderWidth - ${originShoulderWidth_}) + abs(thighCirc - 1.015*${originThighCirc_}) + abs(hipCirc - ${originHipsCirc_})`,
        function (err, res, fields) {
          if (err) {
            return callback(err);
          }
          if (res.length) {
            for (var i = 3; i < 4; i++) {
              models3.push(res[i]);
            }
          }
          callback(null, models3);
        }
      );
    };
    var models4 = [];

    var getModels4 = function (callback) {
      db.query(
        `SELECT id FROM maleData order by(abs(weight - 1.022 *${originWeight_}) +  abs(waistCirc - ${originWaistCirc_})  + abs(neckCirc - ${originNeckCirc_}) + abs(chestCirc - ${originChestCirc_}) + abs(shoulderWidth - ${originShoulderWidth_}) + abs(thighCirc - 1.063 * ${originThighCirc_}) + abs(hipCirc - ${originHipsCirc_}))`,
        function (err, res, fields) {
          if (err) {
            return callback(err);
          }
          if (res.length) {
            for (var i = 4; i < 5; i++) {
              models4.push(res[i]);
            }
          }
          callback(null, models4);
        }
      );
    };
    var models5 = [];

    var getModels5 = function (callback) {
      db.query(
        `SELECT id FROM maleData order by(abs(weight - 0.987 *${originWeight_}) +  abs(waistCirc - 0.981 * ${originWaistCirc_})  + abs(neckCirc - ${originNeckCirc_}) + abs(chestCirc - ${originChestCirc_}) + abs(shoulderWidth - ${originShoulderWidth_}) + abs(thighCirc - ${originThighCirc_}) + abs(hipCirc - 0.981 * ${originHipsCirc_}))`,
        function (err, res, fields) {
          if (err) {
            return callback(err);
          }
          if (res.length) {
            for (var i = 5; i < 6; i++) {
              models5.push(res[i]);
            }
          }
          callback(null, models5);
        }
      );
    };
    var models6 = [];

    var getModels6 = function (callback) {
      db.query(
        "SELECT id FROM maleData order by(abs(weight - 0.981 *${originWeight_}) +  abs(waistCirc - 0.968 * ${originWaistCirc_})  + abs(neckCirc - ${originNeckCirc_}) + abs(chestCirc - ${originChestCirc_}) + abs(shoulderWidth - ${originShoulderWidth_}) + abs(thighCirc - ${originThighCirc_}) + abs(hipCirc - 0.968 * ${originHipsCirc_}))",
        function (err, res, fields) {
          if (err) {
            return callback(err);
          }
          if (res.length) {
            for (var i = 6; i < 7; i++) {
              models6.push(res[i]);
            }
          }
          callback(null, models6);
        }
      );
    };

    getModels0(function (err3, res3) {
      db.query(
        "Insert into maleModels (id) Values(?)",
        [res3[0].id],
        function (err, res) {}
      );
    });
    getModel1(function (err4, res4) {
      db.query(
        "Insert into maleModels (id) Values(?)",
        [res4[0].id],
        function (err, res) {}
      );
    });
    getModel2(function (err5, res5) {
      db.query(
        "Insert into maleModels (id) Values(?)",
        [res5[0].id],
        function (err, res) {}
      );
    });
    getModel3(function (err6, res6) {
      db.query(
        "Insert into maleModels (id) Values(?)",
        [res6[0].id],
        function (err, res) {}
      );
    });
    getModel4(function (err7, res7) {
      db.query(
        "Insert into maleModels (id) Values(?)",
        [res7[0].id],
        function (err, res) {}
      );
    });
    getModel5(function (err8, res8) {
      db.query(
        "Insert into maleModels (id) Values(?)",
        [res8[0].id],
        function (err, res) {}
      );
    });
    getModel6(function (err9, res9) {
      db.query(
        "Insert into maleModels (id) Values(?)",
        [res9[0].id],
        function (err, res) {}
      );
    });
  });
  res.writeHead(302, { Location: "/rendering" });
  res.end();
});
app.use(static(path.join(__dirname + "/models/obj")));
app.get("/rendering", function (err, res) {
  var models = [];

  var getModels = function (callback) {
    db.query("SELECT * FROM maleModels", function (err, res, fields) {
      if (err) {
        return callback(err);
      }
      if (res.length) {
        for (var i = 0; i < 7; i++) {
          models.push(res[i]);
        }
      }
      callback(null, models);
    });
  };
  getModels(function (err2, res2) {
    name0_ = res2[0].id;
    name1_ = res2[1].id;
    name2_ = res2[2].id;
    name3_ = res2[3].id;
    name4_ = res2[4].id;
    name5_ = res2[5].id;
    name6_ = res2[6].id;
    res.render("rendering", {
      name0: name0_,
      name1: name1_,
      name2: name2_,
      name3: name3_,
      name4: name4_,
      name5: name5_,
      name6: name6_,
    });
  });
});
//연결
var port = 3400;
app.listen(port, function () {
  var dir = "sample_data/input/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  console.log("server on! http://localhost:" + port);
});
