//import model
const User = require("./server/user/user.model");
const Seller = require("./server/seller/seller.model");
const LiveSeller = require("./server/liveSeller/liveSeller.model");
const LiveSellingHistory = require("./server/liveSellingHistory/liveSellingHistory.model");
const LiveSellingView = require("./server/liveSellingView/liveSellingView.model");

//moment
const moment = require("moment");

io.on("connection", async (socket) => {
  console.log("Socket Connection done: ", socket.id);

  socket.on("socket_health_check", (payload) => {
    console.log(JSON.parse(payload), socket.id);
  });

  const { liveRoom } = socket.handshake.query;
  console.log("liveRoom", liveRoom);

  const id = liveRoom && liveRoom.split(":")[1];
  console.log("id: ", id);

  socket.join(liveRoom);

  //connect seller in liveRoom
  socket.on("liveRoomConnect", async (data) => {
    console.log("liveRoomConnect  connected:   ", data);

    const abc = JSON.parse(data);
    console.log("liveRoomConnect connected (parsed):   ", abc);

    const sockets = await io.in(liveRoom).fetchSockets();
    //console.log("sockets: ", sockets);

    sockets?.length
      ? sockets[0].join("liveSellerRoom:" + abc.liveSellingHistoryId)
      : console.log("sockets not able to emit");

    io.in("liveSellerRoom:" + abc.liveSellingHistoryId).emit(
      "liveRoomConnect",
      data
    );
  }); //to join the first socket (sockets[0]) to a new room named "liveSellerRoom:" + liveSellingHistoryId

  socket.on("addView", async (data) => {
    console.log("data in addView:  ", data);

    const dataOfaddView = JSON.parse(data);
    console.log("parsed data in addView:  ", dataOfaddView);

    const sockets = await io.in(liveRoom).fetchSockets();
    //console.log("sockets in addView:  ", sockets);

    sockets?.length
      ? sockets[0].join("liveSellerRoom:" + dataOfaddView.liveSellingHistoryId)
      : console.log("sockets not able to emit");

    const user = await User.findById(dataOfaddView.userId);
    const liveSeller = await LiveSeller.findOne({
      liveSellingHistoryId: dataOfaddView.liveSellingHistoryId,
    });

    if (user && liveSeller) {
      const existLiveSellingView = await LiveSellingView.findOne({
        userId: dataOfaddView.userId,
        liveSellingHistoryId: dataOfaddView.liveSellingHistoryId,
      });
      console.log(
        "existLiveSellingView in user and liveSeller (addView):  ",
        existLiveSellingView
      );

      if (!existLiveSellingView) {
        const liveSellingView = new LiveSellingView();

        liveSellingView.userId = dataOfaddView.userId;
        liveSellingView.liveSellingHistoryId =
          dataOfaddView.liveSellingHistoryId;
        liveSellingView.name = user.firstName;
        liveSellingView.image = user.image;

        await liveSellingView.save();
        console.log(
          "new liveSellingView in user and liveSeller (addView): ",
          liveSellingView
        );
      }
    }

    const liveSellingView = await LiveSellingView.find({
      liveSellingHistoryId: dataOfaddView.liveSellingHistoryId,
    });
    console.log("liveSellingView in addView: ", liveSellingView.length);

    if (liveSeller) {
      liveSeller.view = liveSellingView.length;
      await liveSeller.save();
    }

    const xyz = io.sockets.adapter.rooms.get(
      "liveSellerRoom:" + dataOfaddView.liveSellingHistoryId
    );
    console.log("lessView sockets ====================================: ", xyz);

    if (liveSellingView.length === 0)
      return io
        .in("liveSellerRoom:" + dataOfaddView.liveSellingHistoryId)
        .emit("addView", 0);
    io.in("liveSellerRoom:" + dataOfaddView.liveSellingHistoryId).emit(
      "addView",
      liveSellingView.length
    );
  });

  socket.on("lessView", async (data) => {
    console.log("data in lessView:  ", data);

    const dataOflessView = JSON.parse(data);
    console.log("parsed data in lessView:  ", dataOflessView);

    const sockets = await io.in(liveRoom).fetchSockets();
    //console.log("sockets in lessView liveRoom:  ", sockets);

    sockets?.length
      ? sockets[0].leave(
          "liveSellerRoom:" + dataOflessView.liveSellingHistoryId
        )
      : console.log("sockets not able to leave");

    const existLiveSellingView = await LiveSellingView.findOne({
      userId: dataOflessView.userId,
      liveSellingHistoryId: dataOflessView.liveSellingHistoryId,
    });

    if (existLiveSellingView) {
      console.log(
        "existLiveSellingView deleted in lessView for that liveHistoryId"
      );
      await existLiveSellingView.deleteOne();
    }

    const liveSellingView = await LiveSellingView.find({
      liveSellingHistoryId: dataOflessView.liveSellingHistoryId,
    });
    console.log("liveSellingView in lessView:  ", liveSellingView.length);

    const liveSeller = await LiveSeller.findOne({
      liveSellingHistoryId: dataOflessView.liveSellingHistoryId,
    });
    if (liveSeller) {
      liveSeller.view = liveSellingView.length;
      await liveSeller.save();
    }

    if (liveSellingView.length === 0)
      return io
        .in("liveSellerRoom:" + dataOflessView.liveSellingHistoryId)
        .emit("lessView", 0);

    const xyz = io.sockets.adapter.rooms.get(
      "liveSellerRoom:" + dataOflessView.liveSellingHistoryId
    );
    console.log("lessview sockets ====================================: ", xyz);

    io.in("liveSellerRoom:" + dataOflessView.liveSellingHistoryId).emit(
      "lessView",
      liveSellingView.length
    );
  });

  socket.on("comment", async (data) => {
    console.log("data in comment: ", data);

    const dataOfComment = JSON.parse(data);
    console.log("parsed data in comment: ", dataOfComment);
    console.log(
      "data.liveSellingHistoryId in comment: ",
      dataOfComment.liveSellingHistoryId
    );

    const sockets = await io.in(liveRoom).fetchSockets();
    console.log("sockets in comment:  ", sockets);

    sockets?.length
      ? sockets[0].join("liveSellerRoom:" + dataOfComment.liveSellingHistoryId)
      : console.log("sockets not able to emit");

    const liveSellingHistory = await LiveSellingHistory.findById(
      dataOfComment.liveSellingHistoryId
    );
    if (liveSellingHistory) {
      liveSellingHistory.comment += 1;
      await liveSellingHistory.save();
    }

    const abc = io.sockets.adapter.rooms.get(
      "liveSellerRoom:" + dataOfComment.liveSellingHistoryId
    );
    console.log(
      "comment sockets liveSellingHistoryId ====================================: ",
      abc
    );

    const tnz = io.sockets.adapter.rooms.get(liveRoom);
    console.log(
      "comment sockets liveRoom ====================================: ",
      tnz
    );

    io.in("liveSellerRoom:" + dataOfComment.liveSellingHistoryId).emit(
      "comment",
      data
    );
  });

  socket.on("endLiveSeller", async (data) => {
    console.log("data in endLiveSeller: ", data);

    const parsedData = await JSON.parse(data);

    const seller = await Seller.findOne({
      liveSellingHistoryId: parsedData?.liveSellingHistoryId,
    });

    if (seller) {
      if (seller.isLive) {
        const liveSellingHistory = await LiveSellingHistory.findById(
          seller.liveSellingHistoryId
        );
        console.log(
          "liveSellingHistory in endLiveSeller: ",
          liveSellingHistory
        );

        if (liveSellingHistory) {
          liveSellingHistory.endTime = moment(new Date()).format("HH:mm:ss");

          var date1 = moment(liveSellingHistory.startTime, "HH:mm:ss");
          var date2 = moment(liveSellingHistory.endTime, "HH:mm:ss");

          var timeDifference = date2.diff(date1);

          //Convert the time difference to a moment duration
          var duration = moment.duration(timeDifference);

          //Format the duration in "HH:mm:ss" format
          var durationTime = moment
            .utc(duration.asMilliseconds())
            .format("HH:mm:ss");

          liveSellingHistory.duration = durationTime;

          await liveSellingHistory.save();
        }
      }

      const liveSeller = await LiveSeller.findOne({ sellerId: seller._id });
      console.log("liveSeller in endLiveSeller: ", liveSeller.sellerId);

      const existSellerLive = await Seller.findOne({ _id: seller._id });
      console.log(
        "existSellerLive who is live in endLiveSeller: ",
        existSellerLive.isLive
      );

      // seller.isLive = false;
      // await seller.save();

      existSellerLive.isLive = false;
      await existSellerLive.save();

      if (liveSeller) {
        await liveSeller.deleteOne();
        console.log("liveSeller deleted in endLiveSeller");

        await LiveSellingView.deleteMany({
          liveSellingHistoryId: liveSeller.liveSellingHistoryId,
        });
        console.log("liveSellingView deleted in endLiveSeller");
      }

      const existLiveSellingView = await LiveSellingView.findOne({
        liveSellingHistoryId: parsedData.liveSellingHistoryId,
      });
      if (existLiveSellingView) {
        await existLiveSellingView.deleteOne();
        console.log(
          "deleted the viewUser's exist liveSellingView in endLiveSeller: "
        );
      }

      io.in("liveSellerRoom:" + parsedData?.liveSellingHistoryId).emit(
        "endLiveHost",
        "end"
      );

      const sockets = await io
        .in("liveSellerRoom:" + parsedData?.liveSellingHistoryId?.toString())
        .fetchSockets();
      console.log("sockets.length in endLiveSeller: ", sockets.length);

      sockets?.length
        ? io.socketsLeave(
            "liveSellerRoom:" + parsedData?.liveSellingHistoryId?.toString()
          )
        : console.log("sockets not able to leave in endLiveSeller");

      const abcd = io.sockets.adapter.rooms.get(
        "liveSellerRoom:" + parsedData?.liveSellingHistoryId
      );
      console.log("sockets after in endLiveSeller:      ", abcd);
    }
  });

  socket.on("disconnect", async (data) => {
    console.log("disconnect called");
    console.log("id in disconnect :        ", id);

    const seller = await Seller.findById(id);
    if (seller) {
      if (seller.isLive) {
        const liveSellingHistory = await LiveSellingHistory.findById(
          seller.liveSellingHistoryId
        );
        console.log(
          "liveSellingHistory in disconnect liveRoom: ",
          liveSellingHistory
        );

        if (liveSellingHistory) {
          liveSellingHistory.endTime = moment(new Date()).format("HH:mm:ss");

          var date1 = moment(liveSellingHistory.startTime, "HH:mm:ss");
          var date2 = moment(liveSellingHistory.endTime, "HH:mm:ss");

          var timeDifference = date2.diff(date1);

          //Convert the time difference to a moment duration
          var duration = moment.duration(timeDifference);

          //Format the duration in "HH:mm:ss" format
          var durationTime = moment
            .utc(duration.asMilliseconds())
            .format("HH:mm:ss");

          liveSellingHistory.duration = durationTime;
          await liveSellingHistory.save();
        }
      }

      const liveSeller = await LiveSeller.findOne({ sellerId: seller._id });
      console.log("liveSeller in disconnect: ", liveSeller);

      const existSellerLive = await Seller.findById(seller._id);
      console.log(
        "existSellerLive who is live in disconnect: ",
        existSellerLive
      );

      existSellerLive.isLive = false;
      await existSellerLive.save();

      if (liveSeller) {
        await liveSeller.deleteOne();
        console.log("liveSeller deleted deleted in disconnect");

        await LiveSellingView.deleteMany({
          liveSellingHistoryId: liveSeller.liveSellingHistoryId,
        });
        console.log("liveSellingView deleted in disconnect");
      }

      const existLiveSellingView = await LiveSellingView.findOne({
        liveSellingHistoryId: seller.liveSellingHistoryId,
      });
      if (existLiveSellingView) {
        await existLiveSellingView.deleteOne();
        console.log(
          "deleted the viewUser's exist liveSellingView in disconnect: "
        );
      }

      const sockets = await io
        .in("liveSellerRoom:" + seller.liveSellingHistoryId?.toString())
        .fetchSockets();
      console.log("sockets.length in disconnect: ", sockets.length);

      sockets?.length
        ? io.socketsLeave(
            "liveSellerRoom:" + seller.liveSellingHistoryId?.toString()
          )
        : console.log("sockets not able to leave in disconnect");
    }
  });
});
