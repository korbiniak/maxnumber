import type {
  GameState,
  PlayerId,
  Room
} from "shared";

import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  "update-state": (data: { gameId: number; game: GameState }) => void;
  "room-list": (rooms: Room[]) => void;
  "room-joined": (roomId: string) => void;
  "error": (message: string) => void;
}

interface ClientToServerEvents {
  "create-room": (roomId: string) => void;
  "join-room": (roomId: string) => void;
  "make-move": (playerId: PlayerId) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3001");

export default socket;
