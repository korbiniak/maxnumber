import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";

import {GameState, SERVER_PORT, SERVER_ORIGIN, initGameState, PlayerId, Room, Card } from "shared";


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
const current_games = new Map<string, GameState>();
const players_games_id = new Map<string, string>();
const game_watchers = new Map<string, string[]>();

function createGame(p1: string, p2: string, gameId : string) {
    const game = initGameState(p1, p2, gameId);

    current_games.set(gameId, game);
    players_games_id.set(p1, gameId);
    players_games_id.set(p2, gameId);

    setTimeout(() => {
        emitGameState(gameId);
    }, 100);

}

function emitGameState(gameId: string): void {
  const game = current_games.get(gameId);
  if (!game) return;
  const watchers = game_watchers.get(gameId);

  if (watchers?.length) io.to(watchers).emit("update-state", {game_id: game.id, game : game});
  io.to([game.player1Id, game.player2Id]).emit("update-state", { game_id: game.id, game : game });

  console.log(" wysylamy gre graczom i oglądającym: ", game);
}

function deleteGame(gameId?: string, updateState : boolean = false): void {
  if (!gameId) return;
  const game = current_games.get(gameId);
  if (!game) return;

  current_games.delete(gameId);
  players_games_id.delete(game.player1Id);
  players_games_id.delete(game.player2Id);

  const watchers = game_watchers.get(gameId);
  if (watchers) {
    for (let watcherNr = 0; watcherNr < watchers.length; watcherNr++) {
      players_games_id.delete(watchers[watcherNr]);
    }
    if (updateState) io.to(watchers).emit("update-state", {});
    game_watchers.delete(gameId);
  }

  if (updateState) io.to([game.player1Id, game.player2Id]).emit("update-state", {});
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
    
    createGame(room.player1, room.player2, roomId);
}

function createRoom(socket : Socket, roomId : string): void {
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
}

function deleteRoom(roomId : string | null | undefined): void{
  console.log("USUWAMY POKOJ!", roomId);
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room) return;
  rooms.delete(roomId);
  waiting_players.delete(room.player1);
  broadcastRoomList();
}

function tryWatchRoom(socket: Socket, roomId: string): void {
  const game = current_games.get(roomId);

  if (!game) {
    socket.emit("error", "Gra nie istnieje!");
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

  players_games_id.set(socket.id, roomId);

  if (game_watchers.has(roomId)) {
    game_watchers.get(roomId)?.push(socket.id);
  }
  else {
    game_watchers.set(roomId, [socket.id]);
  }

  io.to(socket.id).emit("started-watching", roomId);
}

function stopWatch(socket : Socket): void{
  const game_id = players_games_id.get(socket.id);
  if (!game_id) return;
  const game = current_games.get(game_id);
  if (!game) return;

  if (game.player1Id === socket.id || game.player2Id === socket.id) return;

  players_games_id.delete(socket.id);

  if (game_watchers.has(game_id)) {
    const watchers = game_watchers.get(game_id);
    if (watchers) {
      game_watchers.set(game_id, watchers.filter((id) => id !== socket.id));
    }
  } 
}

function getGame(socket : Socket): void {
  const game_id = players_games_id.get(socket.id);
  if (!game_id) return;
  const game = current_games.get(game_id);
  if (!game) return;
  if (game.player1Id === socket.id || game.player2Id === socket.id) emitGameState(game_id);
  else {
    socket.emit("started-watching", game_id);
    socket.emit("update-state",  { game_id: game.id, game : game });
  }
}

function moveCard(socket: Socket, data : {
  gameId: string;
  target: "my" | "enemy";
  card: Card;
  index: number;
}) : void {
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
}


io.on("connection", (socket) => {

  console.log(`Nowe połączenie: ${socket.id}`);

  socket.emit("room-list", Array.from(rooms.values()));
  console.log("Wysyłam do klienta rooms:", Array.from(rooms.values()));


  socket.on("create-room", (roomId: string) => {
    createRoom(socket, roomId);
  });

  socket.on("get-room-list", ()=>{
    broadcastRoomList();
  })

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
    getGame(socket);
  }) 

  socket.on("delete-game", (updateState : boolean = false) => {
    
    console.log(socket.id, "usuwa gre!", players_games_id, current_games, playersRoomsId, game_watchers);
    const game_id = players_games_id.get(socket.id);
    if (!game_id) return;
    const game = current_games.get(game_id);
    if (!game) return;

    deleteGame(game_id);
    deleteRoom(game_id);

    if (updateState) io.to([game.player1Id, game.player2Id]).emit("update-state", {});
  });

  socket.on("move-card", (data) => {
    moveCard(socket, data);    
  });

  socket.on("start-watch", (roomId : string) => {
      console.log(socket.id, "chce zaczac ogladac gre", roomId);
      tryWatchRoom(socket, roomId);
  });

  socket.on("stop-watch", () => {
    stopWatch(socket);
  });


  socket.on("disconnect", () => {
    console.log(`Rozłączono: ${socket.id}`);
    const gameId = players_games_id.get(socket.id);
    deleteGame(gameId, true);
    const waiting_room_id = playersRoomsId.get(socket.id);
    deleteRoom(waiting_room_id);
    stopWatch(socket);
    broadcastRoomList();
  });
});