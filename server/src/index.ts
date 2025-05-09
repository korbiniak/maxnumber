import express, { Request, Response } from "express";
import { GameState, SERVER_PORT, PlayerId, Card} from "shared";
import http from "http";
import {Server} from "socket.io";


const app = express();
const server = http.createServer(app);
const io = new Server(server);


// It would be nicer if it was defined in shared/constants 
const port = SERVER_PORT;



let current_games = {}; //A dict with current games {id : game}
let last_game_id = 0; //Last game id (to get a new one)

let players_queue : PlayerId[]; //A queue of current waiting players (id)


// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
}); 


function createGame(player_id_1 : PlayerId, player_id_2 : PlayerId | undefined){

    let cards : Card[] = [];
    //get a random cards 




    let game : GameState = {player1Id : "2", player2Id : "2", player1exp : [], player2exp : [], currentTurn : 1, availableCards : cards};



    return ;
}


io.on('connection', (socket) => {
 
    //There is someone in queue
    if (players_queue.length > 0){
        createGame(socket.id, players_queue.shift());
    }
    else{
        players_queue.push(socket.id);
    }

})