import type {
  GameState,
  SERVER_PORT,
  PlayerId,
  Card,
  Room,
} from "shared";
import { io, Socket } from "socket.io-client";


interface ServerToClientEvents {
  "update-state": (data: { game_id: number; game: GameState }) => void;
  "room-list": (rooms: Room[]) => void;
  "room-joined": (roomId: string) => void;
  "error": (message: string) => void;
}

interface ClientToServerEvents {
  "create-room": (roomId: string) => void;
  "join-room": (roomId: string) => void;
  "delete-room": (roomId: string) => void;

  "get-room-list": () => void;
  "get-game": () => void;
  "delete-game": (updateState ?: boolean) => void;

  "move-move": (data: PlayerId) => void;
  "move-card": (data: {
    gameId: number;
    target: "my" | "enemy";
    card: Card;
    index: number;
  }) => void;
}


const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3001", {
  autoConnect: false,
});


export function connectSocket() {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}

export default socket;
