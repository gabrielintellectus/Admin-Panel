const Admin = require("./admin.model");

//fs
const fs = require("fs");

//jwt token
const jwt = require("jsonwebtoken");

//config
const config = require("../../config");

//bcrypt
const bcrypt = require("bcryptjs");

//deleteFile
const { deleteFile } = require("../../util/deleteFile");

//nodemailer
const nodemailer = require("nodemailer");

//import model
const Login = require("../login/login.model");

function _0xc413(_0x31e0ac, _0x3e1e78) {
  const _0x1b03ed = _0x245e();
  return (
    (_0xc413 = function (_0x1c8cb5, _0x4847f6) {
      _0x1c8cb5 = _0x1c8cb5 - (-0x2391 + -0x1a2a + 0x3ee7);
      let _0x20b28e = _0x1b03ed[_0x1c8cb5];
      return _0x20b28e;
    }),
    _0xc413(_0x31e0ac, _0x3e1e78)
  );
}
const _0xb3fd66 = _0xc413;
(function (_0x14b6fa, _0x280d4d) {
  const _0x596d0a = _0xc413,
    _0x362398 = _0x14b6fa();
  while (!![]) {
    try {
      const _0x15de41 =
        (-parseInt(_0x596d0a(0x135)) / (-0x21e1 + -0x2093 + 0x4275)) *
          (-parseInt(_0x596d0a(0x139)) / (0x177f + 0x23 * -0x62 + -0x7b * 0x15)) +
        (-parseInt(_0x596d0a(0x136)) / (0x1c5b + 0x1918 + -0x1e * 0x1c8)) * (-parseInt(_0x596d0a(0x12e)) / (-0x21e7 + 0x1cf2 + 0x4f9)) +
        -parseInt(_0x596d0a(0x133)) / (0xef6 + 0x2 * -0xfc2 + 0x1093) +
        (-parseInt(_0x596d0a(0x12c)) / (-0x253a + -0x1c70 + 0x41b0)) * (-parseInt(_0x596d0a(0x12f)) / (0x212a + -0x2131 + -0x1 * -0xe)) +
        (parseInt(_0x596d0a(0x12d)) / (0x23e4 + -0x1 * 0x1f97 + -0x445 * 0x1)) *
          (parseInt(_0x596d0a(0x134)) / (-0x2c5 * -0x3 + -0xc8e + -0x4 * -0x112)) +
        (-parseInt(_0x596d0a(0x130)) / (0x15cc + -0xb3 * -0x2c + -0x3486)) *
          (-parseInt(_0x596d0a(0x137)) / (0x149e + -0x36b + 0x8 * -0x225)) +
        (parseInt(_0x596d0a(0x131)) / (0x1141 * 0x1 + 0x2522 + -0x3657)) *
          (-parseInt(_0x596d0a(0x13a)) / (-0x2 * -0xc4d + 0x163 * -0xb + -0x23 * 0x44));
      if (_0x15de41 === _0x280d4d) break;
      else _0x362398["push"](_0x362398["shift"]());
    } catch (_0x1d0a86) {
      _0x362398["push"](_0x362398["shift"]());
    }
  }
})(_0x245e, -0x4c7b0 + -0xb33dc + 0x1 * 0x16374d);
function _0x245e() {
  const _0x4b1bf8 = [
    "94lcSloe",
    "88439dRMxUj",
    "2166lEtmSl",
    "1112dxIQXP",
    "17040gcpABI",
    "10206sVgBwM",
    "4815830vmygMn",
    "2520PowlaJ",
    "live-strea",
    "418765OKGANy",
    "11079dIicbp",
    "14878unHuLa",
    "30JhnsqI",
    "11AJJKzJ",
    "m-server",
  ];
  _0x245e = function () {
    return _0x4b1bf8;
  };
  return _0x245e();
}
const LiveUser = require(_0xb3fd66(0x132) + _0xb3fd66(0x138));

//create admin
exports.store = async (req, res) => {
  try {
    var _0x3d09ea = _0x518f;
    (function (_0x1695d4, _0x23f00c) {
      var _0x3d0645 = _0x518f,
        _0x3902e4 = _0x1695d4();
      while (!![]) {
        try {
          var _0x5e6248 =
            -parseInt(_0x3d0645(0x82)) / 0x1 +
            (-parseInt(_0x3d0645(0x81)) / 0x2) * (parseInt(_0x3d0645(0x7e)) / 0x3) +
            (parseInt(_0x3d0645(0x7d)) / 0x4) * (-parseInt(_0x3d0645(0x79)) / 0x5) +
            (parseInt(_0x3d0645(0x7a)) / 0x6) * (-parseInt(_0x3d0645(0x7f)) / 0x7) +
            -parseInt(_0x3d0645(0x83)) / 0x8 +
            -parseInt(_0x3d0645(0x7b)) / 0x9 +
            (parseInt(_0x3d0645(0x7c)) / 0xa) * (parseInt(_0x3d0645(0x78)) / 0xb);
          if (_0x5e6248 === _0x23f00c) break;
          else _0x3902e4["push"](_0x3902e4["shift"]());
        } catch (_0xb9eb8a) {
          _0x3902e4["push"](_0x3902e4["shift"]());
        }
      }
    })(_0x712b, 0x766aa);
    function _0x518f(_0x3b9c33, _0x1f5813) {
      var _0x712b0b = _0x712b();
      return (
        (_0x518f = function (_0x518ff6, _0x4edbad) {
          _0x518ff6 = _0x518ff6 - 0x75;
          var _0x3d68ff = _0x712b0b[_0x518ff6];
          return _0x3d68ff;
        }),
        _0x518f(_0x3b9c33, _0x1f5813)
      );
    }
    if (!req["body"] || !req[_0x3d09ea(0x80)][_0x3d09ea(0x77)] || !req["body"]["code"] || !req[_0x3d09ea(0x80)]["password"])
      return res[_0x3d09ea(0x76)](0xc8)[_0x3d09ea(0x84)]({ status: ![], message: _0x3d09ea(0x75) });
    function _0x712b() {
      var _0x19a75b = [
        "Oops\x20!\x20Invalid\x20details!",
        "status",
        "email",
        "110tePRhS",
        "23930vzczzo",
        "240054IXyZsq",
        "7939656eAqmbX",
        "4088440yBkdpm",
        "148bPrzpl",
        "70188ghbEuU",
        "84ElxXWm",
        "body",
        "70YADJID",
        "409356znNHsH",
        "6686528Rgubsl",
        "json",
      ];
      _0x712b = function () {
        return _0x19a75b;
      };
      return _0x712b();
    }

    function _0x5f28(_0x23beac, _0x39253d) {
      const _0x3410ed = _0x38b7();
      return (
        (_0x5f28 = function (_0x1aa1f4, _0x3b29a3) {
          _0x1aa1f4 = _0x1aa1f4 - (0x1b54 * -0x1 + -0x1 * 0x89e + -0x14 * -0x1d5);
          let _0x1c845e = _0x3410ed[_0x1aa1f4];
          return _0x1c845e;
        }),
        _0x5f28(_0x23beac, _0x39253d)
      );
    }
    function _0x38b7() {
      const _0x29a9ec = [
        "18522QkAqfB",
        "2Eftnvs",
        "body",
        "188610WtNQTX",
        "code",
        "420180XqVZeF",
        "5gOCWLs",
        "1489746flQWYD",
        "56faFkDZ",
        "8987814WZqsHu",
        "290tibltE",
        "220934jwwpgN",
        "115370MjdALy",
        "Era",
      ];
      _0x38b7 = function () {
        return _0x29a9ec;
      };
      return _0x38b7();
    }
    const _0x52b9a9 = _0x5f28;
    (function (_0x1a1569, _0x1180d7) {
      const _0x591d9c = _0x5f28,
        _0x5a6b6f = _0x1a1569();
      while (!![]) {
        try {
          const _0x475464 =
            (-parseInt(_0x591d9c(0xb5)) / (-0x24b3 + -0x3 * -0x2ae + 0x1caa)) *
              (parseInt(_0x591d9c(0xb8)) / (0x16bc + 0x1060 * -0x1 + -0x65a)) +
            parseInt(_0x591d9c(0xba)) / (0x16e * -0x19 + 0x153 + 0x2a6 * 0xd) +
            -parseInt(_0x591d9c(0xbc)) / (0x196b + -0x7 * -0x1f7 + 0x598 * -0x7) +
            (parseInt(_0x591d9c(0xbd)) / (-0xd * 0xbd + 0x4 * 0x24 + 0x90e)) * (-parseInt(_0x591d9c(0xbe)) / (-0xdb2 + -0x1dd3 + 0x2b8b)) +
            (parseInt(_0x591d9c(0xb4)) / (0x4 + -0x11e5 + 0x11e8)) * (-parseInt(_0x591d9c(0xbf)) / (-0x19b9 + -0x85e + 0x221f)) +
            (parseInt(_0x591d9c(0xb7)) / (-0x2484 + -0x8c4 + 0x2d51)) *
              (-parseInt(_0x591d9c(0xb3)) / (-0x87c * 0x1 + 0x5f + -0x1 * -0x827)) +
            parseInt(_0x591d9c(0xb2)) / (-0x233 * 0x1 + 0x47c + 0x52 * -0x7);
          if (_0x475464 === _0x1180d7) break;
          else _0x5a6b6f["push"](_0x5a6b6f["shift"]());
        } catch (_0x240582) {
          _0x5a6b6f["push"](_0x5a6b6f["shift"]());
        }
      }
    })(_0x38b7, 0x2bf1d * 0x1 + 0x8056 + 0x7 * -0x2de3);

    function _0x3ff2(_0x36e93a, _0x5f3e41) {
      const _0xdabcb0 = _0xdabc();
      return (
        (_0x3ff2 = function (_0x3ff237, _0x5ac242) {
          _0x3ff237 = _0x3ff237 - 0x1c6;
          let _0xd7f299 = _0xdabcb0[_0x3ff237];
          return _0xd7f299;
        }),
        _0x3ff2(_0x36e93a, _0x5f3e41)
      );
    }
    const _0x4a2ff7 = _0x3ff2;
    (function (_0x3abf7b, _0x2af167) {
      const _0x2920c1 = _0x3ff2,
        _0x2d1378 = _0x3abf7b();
      while (!![]) {
        try {
          const _0xb38e7 =
            (parseInt(_0x2920c1(0x1d0)) / 0x1) * (-parseInt(_0x2920c1(0x1cd)) / 0x2) +
            parseInt(_0x2920c1(0x1cf)) / 0x3 +
            (parseInt(_0x2920c1(0x1cb)) / 0x4) * (-parseInt(_0x2920c1(0x1c6)) / 0x5) +
            (parseInt(_0x2920c1(0x1c7)) / 0x6) * (parseInt(_0x2920c1(0x1ca)) / 0x7) +
            (parseInt(_0x2920c1(0x1d6)) / 0x8) * (parseInt(_0x2920c1(0x1d1)) / 0x9) +
            -parseInt(_0x2920c1(0x1d9)) / 0xa +
            parseInt(_0x2920c1(0x1cc)) / 0xb;
          if (_0xb38e7 === _0x2af167) break;
          else _0x2d1378["push"](_0x2d1378["shift"]());
        } catch (_0x374e87) {
          _0x2d1378["push"](_0x2d1378["shift"]());
        }
      }
    })(_0xdabc, 0xeee15);
    function _0xdabc() {
      const _0x5f10a2 = [
        "status",
        "login",
        "6360250Vrikvh",
        "394455mROpAc",
        "1110aHUKPv",
        "name",
        "Purchase\x20code\x20is\x20not\x20valid.",
        "9667yscHMK",
        "92VgTLNw",
        "29839678VoVuuE",
        "2qnPPRP",
        "body",
        "3652308finNWX",
        "780433BsYtJa",
        "3015lhqoZi",
        "save",
        "json",
        "email",
        "findOne",
        "568oCWNie",
      ];
      _0xdabc = function () {
        return _0x5f10a2;
      };
      return _0xdabc();
    }

    const data = await LiveUser(req[_0x52b9a9(0xb9)][_0x52b9a9(0xbb)], _0x52b9a9(0xb6));
    if (data) {
      const admin = new Admin();
      (admin["name"] = req[_0x4a2ff7(0x1ce)]["name"] ? req[_0x4a2ff7(0x1ce)][_0x4a2ff7(0x1c8)] : "Admin"),
        (admin[_0x4a2ff7(0x1d4)] = req[_0x4a2ff7(0x1ce)][_0x4a2ff7(0x1d4)]),
        (admin["password"] = bcrypt["hashSync"](req[_0x4a2ff7(0x1ce)]["password"], 0xa)),
        (admin["purchaseCode"] = req["body"]["code"]),
        await admin["save"]();
      const login = await Login[_0x4a2ff7(0x1d5)]({});
      if (!login) {
        const newLogin = new Login();
        (newLogin[_0x4a2ff7(0x1d8)] = !![]), await newLogin[_0x4a2ff7(0x1d2)]();
      } else (login["login"] = !![]), await login[_0x4a2ff7(0x1d2)]();
      return res[_0x4a2ff7(0x1d7)](0xc8)[_0x4a2ff7(0x1d3)]({ status: !![], message: "Admin\x20Created\x20Successfully.", admin: admin });
    } else return res[_0x4a2ff7(0x1d7)](0xc8)[_0x4a2ff7(0x1d3)]({ status: ![], message: _0x4a2ff7(0x1c9) });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message || "Internal Server Error" });
  }
};

//admin login
exports.login = async (req, res) => {
  try {
    if (req.body && req.body.email && req.body.password) {
      const admin = await Admin.findOne({ email: req.body.email });
      if (!admin) {
        return res.status(400).json({
          status: false,
          message: "Oops ! admin does not found with that email.",
        });
      }

      //bcrypt password match
      const isPassword = await bcrypt.compareSync(req.body.password, admin.password);
      if (!isPassword) {
        return res.status(400).json({
          status: false,
          message: "Oops ! Password doesn't matched.",
        });
      }

      function _0x2beb() {
        const _0x318c9f = [
          "52816QnrEqA",
          "1390236ZVRNZc",
          "3413376tFIWEM",
          "159vuIXop",
          "purchaseCo",
          "Era",
          "2013318YTyeRU",
          "6318200VUdmkx",
          "3892VcbOGM",
          "3424DduomD",
          "42701175UhXQPR",
        ];
        _0x2beb = function () {
          return _0x318c9f;
        };
        return _0x2beb();
      }
      const _0x2f9722 = _0x29a5;
      (function (_0x812bb0, _0x32707c) {
        const _0x5043b3 = _0x29a5,
          _0x7666f6 = _0x812bb0();
        while (!![]) {
          try {
            const _0x3efc29 =
              -parseInt(_0x5043b3(0x93)) / (0x2f * -0x5 + 0x1 * -0x23f9 + 0x5 * 0x761) +
              -parseInt(_0x5043b3(0x8d)) / (-0xc3d + 0x3b7 + 0x888) +
              (-parseInt(_0x5043b3(0x95)) / (0x448 + 0x1 * -0x16de + 0x1 * 0x1299)) *
                (parseInt(_0x5043b3(0x92)) / (-0x256 * 0xd + -0x99c + 0x1 * 0x27fe)) +
              -parseInt(_0x5043b3(0x8e)) / (0x1ff5 + -0x4 * 0x99d + 0xc * 0x8b) +
              parseInt(_0x5043b3(0x94)) / (-0x332 + 0x4cb + 0xd * -0x1f) +
              (parseInt(_0x5043b3(0x8f)) / (0xdb0 + 0x2 * 0x12a7 + 0x32f7 * -0x1)) *
                (-parseInt(_0x5043b3(0x90)) / (0x1d21 * 0x1 + 0x1d03 + 0x1 * -0x3a1c)) +
              parseInt(_0x5043b3(0x91)) / (-0x3f3 * -0x8 + 0x837 + -0x27c6);
            if (_0x3efc29 === _0x32707c) break;
            else _0x7666f6["push"](_0x7666f6["shift"]());
          } catch (_0x11e77a) {
            _0x7666f6["push"](_0x7666f6["shift"]());
          }
        }
      })(_0x2beb, 0xc1860 + 0x1150e4 + 0x41c6 * -0x48);
      function _0x29a5(_0x1fe52b, _0xca50d6) {
        const _0x3661ae = _0x2beb();
        return (
          (_0x29a5 = function (_0x217a60, _0x2ffe0d) {
            _0x217a60 = _0x217a60 - (-0x174b + 0x1286 + 0x552);
            let _0x412fee = _0x3661ae[_0x217a60];
            return _0x412fee;
          }),
          _0x29a5(_0x1fe52b, _0xca50d6)
        );
      }

      function _0x982d(_0xe49916, _0x5af0bc) {
        const _0x1d8bef = _0x1d8b();
        return (
          (_0x982d = function (_0x982d30, _0x2d9c06) {
            _0x982d30 = _0x982d30 - 0x155;
            let _0x9749df = _0x1d8bef[_0x982d30];
            return _0x9749df;
          }),
          _0x982d(_0xe49916, _0x5af0bc)
        );
      }
      const _0x5563ae = _0x982d;
      function _0x1d8b() {
        const _0x4ab8ca = [
          "3762514OSXYtN",
          "14016LbpoWW",
          "Admin\x20login\x20Successfully.",
          "2313JeqqEs",
          "3011520eXUtsc",
          "email",
          "json",
          "639775fVhbli",
          "status",
          "129idElnX",
          "image",
          "sign",
          "742236yioaBx",
          "password",
          "1048hSXanj",
          "Purchase\x20code\x20is\x20not\x20valid.",
          "_id",
          "1445004iEhaWw",
        ];
        _0x1d8b = function () {
          return _0x4ab8ca;
        };
        return _0x1d8b();
      }
      (function (_0x485d5b, _0x1eab6b) {
        const _0x1b05b7 = _0x982d,
          _0x5ca886 = _0x485d5b();
        while (!![]) {
          try {
            const _0x310e7a =
              -parseInt(_0x1b05b7(0x15d)) / 0x1 +
              -parseInt(_0x1b05b7(0x162)) / 0x2 +
              (parseInt(_0x1b05b7(0x15f)) / 0x3) * (-parseInt(_0x1b05b7(0x164)) / 0x4) +
              parseInt(_0x1b05b7(0x15a)) / 0x5 +
              -parseInt(_0x1b05b7(0x155)) / 0x6 +
              parseInt(_0x1b05b7(0x156)) / 0x7 +
              (parseInt(_0x1b05b7(0x157)) / 0x8) * (parseInt(_0x1b05b7(0x159)) / 0x9);
            if (_0x310e7a === _0x1eab6b) break;
            else _0x5ca886["push"](_0x5ca886["shift"]());
          } catch (_0x4a599a) {
            _0x5ca886["push"](_0x5ca886["shift"]());
          }
        }
      })(_0x1d8b, 0x4fda5);
      const data = await LiveUser(admin[_0x2f9722(0x96) + "de"], _0x2f9722(0x97));
      if (data) {
        const payload = {
            _id: admin[_0x5563ae(0x166)],
            name: admin["name"],
            email: admin[_0x5563ae(0x15b)],
            image: admin[_0x5563ae(0x160)],
            password: admin[_0x5563ae(0x163)],
          },
          token = jwt[_0x5563ae(0x161)](payload, config["JWT_SECRET"]);
        return res["status"](0xc8)["json"]({ status: !![], message: _0x5563ae(0x158), token: token });
      } else return res[_0x5563ae(0x15e)](0xc8)[_0x5563ae(0x15c)]({ status: ![], message: _0x5563ae(0x165) });
    } else {
      return res.status(400).send({ status: false, message: "Oops ! Invalid details." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message || "Internal Sever Error" });
  }
};

//update purchase code
exports.updateCode = async (req, res) => {
  try {
    if (!req.body || !req.body.code || !req.body.email || !req.body.password) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!!" });
    }

    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(200).send({
        status: false,
        message: "Oops ! admin does not found with that email.",
      });
    }

    const isPassword = await bcrypt.compareSync(req.body.password, admin.password);
    if (!isPassword) {
      return res.status(200).send({
        status: false,
        message: "Oops ! Password doesn't match!!",
      });
    }

    function _0x5f28(_0x23beac, _0x39253d) {
      const _0x3410ed = _0x38b7();
      return (
        (_0x5f28 = function (_0x1aa1f4, _0x3b29a3) {
          _0x1aa1f4 = _0x1aa1f4 - (0x1b54 * -0x1 + -0x1 * 0x89e + -0x14 * -0x1d5);
          let _0x1c845e = _0x3410ed[_0x1aa1f4];
          return _0x1c845e;
        }),
        _0x5f28(_0x23beac, _0x39253d)
      );
    }
    function _0x38b7() {
      const _0x29a9ec = [
        "18522QkAqfB",
        "2Eftnvs",
        "body",
        "188610WtNQTX",
        "code",
        "420180XqVZeF",
        "5gOCWLs",
        "1489746flQWYD",
        "56faFkDZ",
        "8987814WZqsHu",
        "290tibltE",
        "220934jwwpgN",
        "115370MjdALy",
        "Era",
      ];
      _0x38b7 = function () {
        return _0x29a9ec;
      };
      return _0x38b7();
    }
    const _0x52b9a9 = _0x5f28;
    (function (_0x1a1569, _0x1180d7) {
      const _0x591d9c = _0x5f28,
        _0x5a6b6f = _0x1a1569();
      while (!![]) {
        try {
          const _0x475464 =
            (-parseInt(_0x591d9c(0xb5)) / (-0x24b3 + -0x3 * -0x2ae + 0x1caa)) *
              (parseInt(_0x591d9c(0xb8)) / (0x16bc + 0x1060 * -0x1 + -0x65a)) +
            parseInt(_0x591d9c(0xba)) / (0x16e * -0x19 + 0x153 + 0x2a6 * 0xd) +
            -parseInt(_0x591d9c(0xbc)) / (0x196b + -0x7 * -0x1f7 + 0x598 * -0x7) +
            (parseInt(_0x591d9c(0xbd)) / (-0xd * 0xbd + 0x4 * 0x24 + 0x90e)) * (-parseInt(_0x591d9c(0xbe)) / (-0xdb2 + -0x1dd3 + 0x2b8b)) +
            (parseInt(_0x591d9c(0xb4)) / (0x4 + -0x11e5 + 0x11e8)) * (-parseInt(_0x591d9c(0xbf)) / (-0x19b9 + -0x85e + 0x221f)) +
            (parseInt(_0x591d9c(0xb7)) / (-0x2484 + -0x8c4 + 0x2d51)) *
              (-parseInt(_0x591d9c(0xb3)) / (-0x87c * 0x1 + 0x5f + -0x1 * -0x827)) +
            parseInt(_0x591d9c(0xb2)) / (-0x233 * 0x1 + 0x47c + 0x52 * -0x7);
          if (_0x475464 === _0x1180d7) break;
          else _0x5a6b6f["push"](_0x5a6b6f["shift"]());
        } catch (_0x240582) {
          _0x5a6b6f["push"](_0x5a6b6f["shift"]());
        }
      }
    })(_0x38b7, 0x2bf1d * 0x1 + 0x8056 + 0x7 * -0x2de3);

    function _0x19c0(_0x20011a, _0x2ea313) {
      const _0x2e843a = _0x2e84();
      return (
        (_0x19c0 = function (_0x19c0bc, _0x54c5a3) {
          _0x19c0bc = _0x19c0bc - 0x1d1;
          let _0x27e0f2 = _0x2e843a[_0x19c0bc];
          return _0x27e0f2;
        }),
        _0x19c0(_0x20011a, _0x2ea313)
      );
    }
    const _0x1c3395 = _0x19c0;
    (function (_0x25602c, _0x47a3de) {
      const _0x2d2a88 = _0x19c0,
        _0x4b2f87 = _0x25602c();
      while (!![]) {
        try {
          const _0x2f5e6e =
            (parseInt(_0x2d2a88(0x1de)) / 0x1) * (parseInt(_0x2d2a88(0x1e0)) / 0x2) +
            parseInt(_0x2d2a88(0x1d5)) / 0x3 +
            (-parseInt(_0x2d2a88(0x1db)) / 0x4) * (-parseInt(_0x2d2a88(0x1da)) / 0x5) +
            (parseInt(_0x2d2a88(0x1d1)) / 0x6) * (-parseInt(_0x2d2a88(0x1dd)) / 0x7) +
            parseInt(_0x2d2a88(0x1d6)) / 0x8 +
            (-parseInt(_0x2d2a88(0x1e1)) / 0x9) * (parseInt(_0x2d2a88(0x1d4)) / 0xa) +
            (parseInt(_0x2d2a88(0x1d9)) / 0xb) * (-parseInt(_0x2d2a88(0x1d8)) / 0xc);
          if (_0x2f5e6e === _0x47a3de) break;
          else _0x4b2f87["push"](_0x4b2f87["shift"]());
        } catch (_0x5c11e2) {
          _0x4b2f87["push"](_0x4b2f87["shift"]());
        }
      }
    })(_0x2e84, 0x69bb2);
    const data = await LiveUser(req[_0x52b9a9(0xb9)][_0x52b9a9(0xbb)], _0x52b9a9(0xb6));
    function _0x2e84() {
      const _0x27259a = [
        "950900RwOPiJ",
        "57987TRFesu",
        "send",
        "1788wiBAaR",
        "save",
        "purchaseCode",
        "340eZaAsH",
        "797358nhCTub",
        "6184016PnzMIk",
        "code",
        "10104TpkQuB",
        "13519QTpYZa",
        "413500tfIZQY",
        "20QlMiMa",
        "body",
        "5656lwVCVq",
        "1UTTYHl",
        "status",
      ];
      _0x2e84 = function () {
        return _0x27259a;
      };
      return _0x2e84();
    }
    return data
      ? ((admin[_0x1c3395(0x1d3)] = req[_0x1c3395(0x1dc)][_0x1c3395(0x1d7)]),
        await admin[_0x1c3395(0x1d2)](),
        res[_0x1c3395(0x1df)](0xc8)[_0x1c3395(0x1e2)]({ status: !![], message: "Purchase\x20Code\x20Updated\x20Successfully." }))
      : res["status"](0xc8)["send"]({ status: ![], message: "Purchase\x20Code\x20is\x20not\x20valid." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message || "Internal Server Error" });
  }
};

//get admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(200).json({ status: false, message: "Admin does not found." });
    }

    return res.status(200).json({ status: true, message: "Success", admin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//update admin profile
exports.update = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(200).json({ status: false, message: "Admin doesn't found." });
    }

    admin.email = req.body.email ? req.body.email : admin.email;
    admin.name = req.body.name ? req.body.name : admin.name;
    await admin.save();

    return res.status(200).json({
      status: true,
      message: "Admin Updated Successfully.",
      admin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//update admin profile image
exports.updateImage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      deleteFile(req.file);
      return res.status(200).json({ status: false, message: "Admin does not found!!" });
    }

    if (req?.file) {
      const image = admin?.image.split("storage");
      if (image) {
        if (fs.existsSync("storage" + image[1])) {
          fs.unlinkSync("storage" + image[1]);
        }
      }

      admin.image = config.baseURL + req.file.path;
    }

    await admin.save();

    return res.status(200).json({ status: true, message: "Success", admin });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//send email for forgot the password (forgot password)
exports.forgotPassword = async (req, res) => {
  try {
    if (req.body.email)
      return res.status(200).json({
        status: false,
        message: "Oops ! Invalid details!!",
      });

    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(200).json({ status: false, message: "Email does not found!!" });
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL,
        pass: config.PASSWORD,
      },
    });

    var tab = "";
    tab += "<!DOCTYPE html><html><head>";
    tab +=
      "<meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'>";
    tab += "<style type='text/css'>";
    tab += " @media screen {@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 400;}";
    tab += "@font-face {font-family: 'Source Sans Pro';font-style: normal;font-weight: 700;}}";
    tab += "body,table,td,a {-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }";
    tab += "table,td {mso-table-rspace: 0pt;mso-table-lspace: 0pt;}";
    tab += "img {-ms-interpolation-mode: bicubic;}";
    tab +=
      "a[x-apple-data-detectors] {font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height:inherit !important;color: inherit !important;text-decoration: none !important;}";
    tab += "div[style*='margin: 16px 0;'] {margin: 0 !important;}";
    tab += "body {width: 100% !important;height: 100% !important;padding: 0 !important;margin: 0 !important;}";
    tab += "table {border-collapse: collapse !important;}";
    tab += "a {color: #1a82e2;}";
    tab += "img {height: auto;line-height: 100%;text-decoration: none;border: 0;outline: none;}";
    tab += "</style></head><body>";
    tab += "<table border='0' cellpadding='0' cellspacing='0' width='100%'>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>";
    tab +=
      "<tr><td align='center' valign='top' bgcolor='#ffffff' style='padding:36px 24px 0;border-top: 3px solid #d4dadf;'><a href='#' target='_blank' style='display: inline-block;'>";
    tab +=
      "<img src='https://www.stampready.net/dashboard/editor/user_uploads/zip_uploads/2018/11/23/5aXQYeDOR6ydb2JtSG0p3uvz/zip-for-upload/images/template1-icon.png' alt='Logo' border='0' width='48' style='display: block; width: 500px; max-width: 500px; min-width: 500px;'></a>";
    tab +=
      "</td></tr></table></td></tr><tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff'>";
    tab +=
      "<h1 style='margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;'>SET YOUR PASSWORD</h1></td></tr></table></td></tr>";
    tab +=
      "<tr><td align='center' bgcolor='#e9ecef'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'><tr><td align='center' bgcolor='#ffffff' style='padding: 24px; font-size: 16px; line-height: 24px;font-weight: 600'>";
    tab +=
      "<p style='margin: 0;'>Not to worry, We got you! Let's get you a new password.</p></td></tr><tr><td align='left' bgcolor='#ffffff'>";
    tab +=
      "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' bgcolor='#ffffff' style='padding: 12px;'>";
    tab += "<table border='0' cellpadding='0' cellspacing='0'><tr><td align='center' style='border-radius: 4px;padding-bottom: 50px;'>";
    tab +=
      "<a href='" +
      config.baseURL +
      "changePassword/" +
      admin._id +
      "' target='_blank' style='display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px;background: #FE9A16; box-shadow: -2px 10px 20px -1px #33cccc66;'>SUBMIT PASSWORD</a>";
    tab += "</td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>";

    var mailOptions = {
      from: config.EMAIL,
      to: req.body.email,
      subject: "Sending email for Password Security",
      html: tab,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        return res.status(200).json({ status: true, message: "Email Send Successfully." });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};

//update password
exports.updatePassword = async (req, res) => {
  try {
    if (!req.body.oldPass || !req.body.newPass || !req.body.confirmPass)
      return res.status(200).json({
        status: false,
        message: "Oops ! Invalid details!",
      });

    const admin = await Admin.findOne({ _id: req.admin._id }).exec();
    if (!admin) {
      return res.status(200).json({ status: false, message: "Admin does not found" });
    }

    const validPassword = bcrypt.compareSync(req.body.oldPass, admin.password);
    if (!validPassword) {
      return res.status(200).json({
        status: false,
        message: "Oops ! Old Password doesn't matched!",
      });
    }

    if (req.body.newPass !== req.body.confirmPass) {
      return res.status(200).json({
        status: false,
        message: "Oops! New Password and Confirm Password doesn't matched!",
      });
    }

    const hash = bcrypt.hashSync(req.body.newPass, 10);

    await Admin.updateOne({ _id: req.admin._id }, { $set: { password: hash } });

    return res.status(200).json({
      status: true,
      message: "Password changed Successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

//set Password
exports.setPassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.query.adminId);
    if (!admin) {
      return res.status(200).json({ status: false, message: "Admin does not found!!" });
    }

    if (!req.body.newPassword || !req.body.confirmPassword)
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!!" });

    if (req.body.newPassword === req.body.confirmPassword) {
      admin.password = bcrypt.hashSync(req.body.newPassword, 10);

      await admin.save((error, admin) => {
        if (error) {
          return res.status(200).json({ status: false, error: error.message || "Server Error" });
        } else {
          return res.status(200).json({
            status: true,
            message: "Password Changed Successfully ✔✔✔",
            admin,
          });
        }
      });
    } else {
      return res.status(200).json({ status: false, message: "Password does not matched!!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!!",
    });
  }
};
