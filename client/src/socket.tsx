import type { GameState, SERVER_PORT, PlayerId, Card, NUMBER_DIGIT_CARDS_IN_GAME, ALL_DIGIT_CARDS, NUMBER_OPERATION_CARDS_IN_GAME, ALL_OPERATION_CARDS} from "shared";
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  "update-state": (data: { game_id: number; game: GameState }) => void;
}


interface ClientToServerEvents {
  "make-move": (data : PlayerId) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3001");

export default socket;
