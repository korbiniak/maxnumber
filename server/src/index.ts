import express, { Request, Response } from "express";
import { GameState, SERVER_PORT, PlayerId, Card, NUMBER_DIGIT_CARDS_IN_GAME, ALL_DIGIT_CARDS, NUMBER_OPERATION_CARDS_IN_GAME, ALL_OPERATION_CARDS} from "shared";
import http from "http";
import {Server} from "socket.io";


const app = express();
const server = http.createServer(app);
const io = new Server(server);


// It would be nicer if it was defined in shared/constants 
const port = SERVER_PORT;



const current_games = new Map(); //A dict with current games {id : game}
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


function createGame(player_id_1 : PlayerId, player_id_2 : PlayerId) : GameState{

    let cards : Card[] = [];
    //get a random cards 
    for (let nr_card = 0; nr_card < NUMBER_DIGIT_CARDS_IN_GAME; nr_card++){
        cards.push(ALL_DIGIT_CARDS[Math.floor(Math.random() * ALL_DIGIT_CARDS.length)]);
    }

    for (let nr_card = 0; nr_card < NUMBER_OPERATION_CARDS_IN_GAME; nr_card++){
        cards.push(ALL_OPERATION_CARDS[Math.floor(Math.random() * ALL_OPERATION_CARDS.length)]);
    }


    //Init a game
    let game : GameState = {player1Id : player_id_1, player2Id : player_id_2, player1exp : [], player2exp : [], currentTurn : (Math.floor(Math.random() * 2) + 1 as 1 | 2), availableCards : cards};

    return game;
}



function emit_game_state(game_id : number) : void{

    const game : GameState = current_games.get(game_id); 

    io.to(game.player1Id).emit("update-state", {game_id : game_id, game : game});
    io.to(game.player2Id).emit("update-state", {game_id : game_id, game : game});
}




io.on('connection', (socket) => {
 
    //There is someone in queue
    if (players_queue.length > 0){
        //Create new game and add it to the current games
        let game : GameState = createGame(socket.id, players_queue.shift() as string);

        const game_id = last_game_id + 1;
        last_game_id = game_id;

        current_games.set(game_id, game);

        emit_game_state(game_id);
    }
    else{
        players_queue.push(socket.id);
    }

})