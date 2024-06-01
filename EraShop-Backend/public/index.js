document.addEventListener("DOMContentLoaded", function () {
  var socket = io();
  // "wss://service.livepay.app.br"

  const toggle = document.getElementById("toggle");

  toggle.addEventListener("click", function () {
    socket.emit(
      "socket_health_check",
      JSON.stringify({
        message: "socket_health_check",
      })
    );
  });
});
