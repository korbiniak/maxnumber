import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";

import {GameState, SERVER_PORT, SERVER_ORIGIN, initGameState, PlayerId, Room } from "shared";


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: SERVER_ORIGIN
  }
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Socket.IO server działa!" });
});

server.listen(SERVER_PORT, () => {
  console.log(`Serwer działa na http://localhost:${SERVER_PORT}`);
});



const rooms = new Map<string, Room>();
const current_games = new Map<number, GameState>();
const players_games_id = new Map<string, number>();
let last_game_id = 0;

function createGame(p1: string, p2: string): number {
  const game = initGameState(p1, p2);
  const gameId = ++last_game_id;

  current_games.set(gameId, game);
  players_games_id.set(p1, gameId);
  players_games_id.set(p2, gameId);

  emitGameState(gameId);
  return gameId;
}

function emitGameState(gameId: number): void {
  const game = current_games.get(gameId);
  if (!game) return;

  io.to([game.player1Id, game.player2Id]).emit("update-state", { gameId, game});
}

function deleteGame(gameId?: number): void {
  if (!gameId) return;
  const game = current_games.get(gameId);
  if (!game) return;

  current_games.delete(gameId);
  players_games_id.delete(game.player1Id);
  players_games_id.delete(game.player2Id);

  io.to([game.player1Id, game.player2Id]).emit("update-state");
}

function broadcastRoomList(): void {
  const roomList = Array.from(rooms.values()).map(room => ({
    id: room.id,
    players: room.players
  }));

  io.emit("room-list", roomList);
}


function removeFromRoom(socketId: string): void {
  for (const [roomId, room] of rooms) {
    if (room.players.includes(socketId)) {
      room.players = room.players.filter(id => id !== socketId);

      if (room.gameId) {
        deleteGame(room.gameId);
      }

      if (room.players.length === 0) {
        rooms.delete(roomId);
      }

      break;
    }
  }
}

function tryJoinRoom(socket: Socket, roomId: string): void {
  const room = rooms.get(roomId);

  if (!room) {
    socket.emit("error", "Pokój nie istnieje");
    return;
  }

  if (room.players.length >= 2) {
    socket.emit("error", "Pokój jest pełny");
    return;
  }

  room.players.push(socket.id);
  socket.join(roomId);
  socket.emit("room-joined", roomId);

  if (room.players.length === 2) {
    const [p1, p2] = room.players;
    const gameId = createGame(p1, p2);
    room.gameId = gameId;
  }

  broadcastRoomList();
}


io.on("connection", (socket) => {
  console.log(`Nowe połączenie: ${socket.id}`);

  socket.emit("room-list", Array.from(rooms.values()));
  console.log("Wysyłam do klienta rooms:", Array.from(rooms.values()));


  socket.on("create-room", (roomId: string) => {
    if (rooms.has(roomId)) {
      socket.emit("error", "Pokój już istnieje");
      return;
    }

    const room: Room = { id: roomId, players: [socket.id] };
    rooms.set(roomId, room);
    socket.join(roomId);
    socket.emit("room-joined", roomId);
    broadcastRoomList();
  });

  socket.on("join-room", (roomId: string) => {
    tryJoinRoom(socket, roomId);
  });

  socket.on("disconnect", () => {
    console.log(`Rozłączono: ${socket.id}`);
    const gameId = players_games_id.get(socket.id);
    deleteGame(gameId);
    removeFromRoom(socket.id);
    broadcastRoomList();
  });
});
