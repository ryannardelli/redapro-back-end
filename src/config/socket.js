const { Server } = require("socket.io");

function setupSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Usuário ${userId} entrou na sala user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  return io;
}

module.exports = setupSocket;