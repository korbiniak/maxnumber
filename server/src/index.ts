import express, { Request, Response } from "express";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { GameState } from "shared";
import http from "http";
import {Server} from "socket.io";
=======
import { GameState, SERVER_PORT } from "../../shared";
>>>>>>> Stashed changes
=======
import { GameState, SERVER_PORT } from "../../shared";
>>>>>>> Stashed changes


const app = express();
const server = http.createServer(app);
const io = new Server(server);


// It would be nicer if it was defined in shared/constants 
const port = SERVER_PORT;


let current_games = {}; //A dict with current games {id : game}
let last_game_id = 0; //Last game id (to get a new one)

let players_queue = []; //A queue of current waiting players (id)
//players_queue.shift();

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});

<<<<<<< Updated upstream
<<<<<<< Updated upstream
io.on('connection', (socket) => {
    
})
=======

=======
>>>>>>> Stashed changes





<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======

>>>>>>> Stashed changes
