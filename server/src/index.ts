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
const playersRoomsId = new Map<string, string>();
const waiting_players = new Set<string>();
const current_games = new Map<number, GameState>();
const players_games_id = new Map<string, number>();
let last_game_id = 0;

function createGame(p1: string, p2: string): number {
    const gameId = ++last_game_id;
    const game = initGameState(p1, p2, gameId);
  

    current_games.set(gameId, game);
    players_games_id.set(p1, gameId);
    players_games_id.set(p2, gameId);

    setTimeout(() => {
        emitGameState(gameId);
    }, 100);
    return gameId;
}

function emitGameState(gameId: number): void {
  const game = current_games.get(gameId);
  if (!game) return;

  io.to([game.player1Id, game.player2Id]).emit("update-state", { game_id: game.id, game : game });

  console.log(" wysylamy gre graczom ", game);
}

function deleteGame(gameId?: number): void {
  if (!gameId) return;
  const game = current_games.get(gameId);
  if (!game) return;

  current_games.delete(gameId);
  players_games_id.delete(game.player1Id);
  players_games_id.delete(game.player2Id);

  io.to([game.player1Id, game.player2Id]).emit("update-state", {});
}

function broadcastRoomList(): void {
  const roomList = Array.from(rooms.values()).map(room => ({
    name: room.name,
    player1 : room.player1,
    playersNum : room.playersNum
  }));

  io.emit("room-list", roomList);
}

function tryJoinRoom(socket: Socket, roomId: string): void {
    const room = rooms.get(roomId);

    if (!room) {
        socket.emit("error", "Pokój nie istnieje!");
        return;
    }

    if (players_games_id.has(socket.id)) {
      socket.emit("error", "Jesteś aktualnie w grze!");
      return;
    }

    if (waiting_players.has(socket.id)) {
      socket.emit("error", "Usuń swój pokój!");
      return;
    }

    if (room.playersNum === 2) {
        socket.emit("error", "Pokój jest pełny");
        return;
    }

    waiting_players.delete(room.player1);
    playersRoomsId.set(socket.id, roomId);
    io.to([socket.id, room.player1]).emit("room-joined", roomId);
    room.player2 = socket.id;
    room.playersNum = 2;
    console.log(" tworzymy gre w pokoju o nazwie ", roomId);
    const gameId = createGame(room.player1, room.player2);
    room.gameId = gameId;
}


function deleteRoom(roomId : string | null | undefined){
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room) return;
  rooms.delete(roomId);
  waiting_players.delete(room.player1);
  broadcastRoomList();
}

io.on("connection", (socket) => {

  console.log(`Nowe połączenie: ${socket.id}`);

  socket.emit("room-list", Array.from(rooms.values()));
  console.log("Wysyłam do klienta rooms:", Array.from(rooms.values()));


  socket.on("create-room", (roomId: string) => {
    if (rooms.has(roomId)) {
      socket.emit("error", "Pokój już istnieje!");
      return;
    }

    if (players_games_id.has(socket.id)) {
      socket.emit("error", "Jesteś aktualnie w grze!");
      return;
    }

    if (waiting_players.has(socket.id)) {
      socket.emit("error", "Usuń stary pokój!");
      return;
    }

    const room: Room = { name: roomId, player1 : socket.id, playersNum : 1};
    rooms.set(roomId, room);
    waiting_players.add(socket.id);
    playersRoomsId.set(socket.id, roomId);
    broadcastRoomList();
  });

  socket.on("get-room-list", ()=>{broadcastRoomList();})


  socket.on("join-room", (roomId: string) => {
    tryJoinRoom(socket, roomId);
    broadcastRoomList();
  });

  socket.on("delete-room", (roomId : string) => {
    deleteRoom(roomId);
    broadcastRoomList();
  });


  socket.on("get-game", () => {
    console.log("Gracz ", socket.id, " chce dostac gre!");
    const game_id = players_games_id.get(socket.id);
    if (!game_id) return;
    emitGameState(game_id);
  }) 

  socket.on("delete-game", (updateState : boolean = false) => {
    console.log(socket.id, "usuwa gre!", players_games_id, current_games);
    const game_id = players_games_id.get(socket.id);
    if (!game_id) return;
    const game = current_games.get(game_id);
    if (!game) return;

    deleteGame(game_id);
    const waiting_room_id = playersRoomsId.get(socket.id);
    deleteRoom(waiting_room_id);
    if (updateState) io.to([game.player1Id, game.player2Id]).emit("update-state", {});
  });


  socket.on("move-card", (data) => {
        const { gameId, target, card, index } = data;

        console.log("Ruch gracza:", data); // np. data.card, data.target, data.index

        const game = current_games.get(gameId);
        if (!game) {
            console.log("Nie znaleziono gry");
            return;
        }

        const isPlayer1 = socket.id === game.player1Id;

        if (target === "my") {
            const exp = isPlayer1 ? game.player1exp : game.player2exp;
            exp.splice(index, 0, card);
            console.log("dodajemy karte do wyrazenia ", exp , " w miejscu ", index);
        } else if (target === "enemy") {
            const exp = isPlayer1 ? game.player2exp : game.player1exp;
            exp.splice(index, 0, card);
            console.log("dodajemy karte do wyrazenia ", exp , " w miejscu ", index);
        }

        const cardIndex = game.availableCards.indexOf(card);
        if (cardIndex !== -1) {
            game.availableCards.splice(cardIndex, 1);
        }
        if(game.currentTurn === 1) game.currentTurn = 2;
        else game.currentTurn = 1;
        emitGameState(game.id);
        console.log(" robimy update : ", game);
    });


  socket.on("disconnect", () => {
    console.log(`Rozłączono: ${socket.id}`);
    const gameId = players_games_id.get(socket.id);
    deleteGame(gameId);
    const waiting_room_id = playersRoomsId.get(socket.id);
    deleteRoom(waiting_room_id);
    broadcastRoomList();
  });
});