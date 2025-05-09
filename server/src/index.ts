import express, { Request, Response } from "express";
import { GameState, SERVER_PORT, PlayerId, SERVER_ORIGIN, initGameState} from "shared";
import http from "http";
import {Server} from "socket.io";


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin : SERVER_ORIGIN 
    }
});



const players_games_id = new Map(); //Player game id
const current_games = new Map(); //A dict with current games {id : game}
let last_game_id = 0; //Last game id (to get a new one)

let players_queue : PlayerId[] = []; //A queue of current waiting players (id)


// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Start the Express server
server.listen(SERVER_PORT, () => {
    console.log(`The server is running at http://localhost:${SERVER_PORT}`);
}); 




//Emit actual state of game to players
function emitGameState(game_id : number) : void{

    const game : GameState = current_games.get(game_id); 

    io.to([game.player1Id, game.player2Id]).emit("update-state", {game_id : game_id, game : game});
}

//Create new game and add it to the queue
function createGame(player1Id : string, player2Id : string){
    let game : GameState = initGameState(player1Id, player2Id);

    const game_id = last_game_id + 1;
    last_game_id = game_id;

    current_games.set(game_id, game);

    emitGameState(game_id);

    players_games_id.set(player1Id, game_id);
    players_games_id.set(player2Id, game_id);

}

//Delete a game if it exists
function deleteGame(gameIdx : number | undefined){

    if (gameIdx === undefined) return;

    const game = current_games.get(gameIdx);
    if (game === undefined) return;

    current_games.delete(gameIdx);


    players_queue.push(game.player1Id);
    players_queue.push(game.player2Id);
    players_games_id.delete(game.player1Id);
    players_games_id.delete(game.player2Id);

    io.to([game.player1Id, game.player2Id]).emit("update-state");
   
}


io.on('connection', (socket) => {


    //There is someone already in queue
    if (players_queue.length > 0){
        //Create the new game and get index of it
        createGame(socket.id, players_queue.shift() as string);
    }
    else{
        players_queue.push(socket.id);
    }



    socket.on('disconnect', () => {
        
        let gameIdx : number | undefined = players_games_id.get(socket.id);
        deleteGame(gameIdx);
        

        //delete player from queue
        const player_idx = players_queue.indexOf(socket.id);
        if (player_idx != -1){
            players_queue.splice(players_queue.indexOf(socket.id), 1);
        }
        console.log(current_games);
    });

})
