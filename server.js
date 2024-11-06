const express = require('express');
const path = require('path');
const { createServer } = require("http");
const { Server } = require("socket.io");

// Express 애플리케이션 및 서버 초기화
const app = express();
const port = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer);

// 정적 파일 제공 (index.html 포함)
app.get("/", (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "index.html"));
});

// Socket.IO 연결 설정
io.on("connection", (socket) => {
    console.log("A user connected! : ", socket.id);

    // 클라이언트로부터 아이디와 메시지를 수신하고 다시 전송
    socket.on("message", ({ id, message }) => {
        console.log(`Received message from ${id}: ${message}`);
        io.emit("message", { id, message }); // 모든 클라이언트에게 아이디와 메시지 전달
    });

    // 클라이언트가 연결 해제되었을 때 로그 출력
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// HTTP 서버 시작
httpServer.listen(port, () => {
    console.log(`${port}번 포트에서 서버 실행 중`);
});
