import { ALL_DIGIT_CARDS, ALL_OPERATION_CARDS, NUMBER_DIGIT_CARDS_IN_GAME, NUMBER_OPERATION_CARDS_IN_GAME } from "./constants";
import type { PlayerId, Card, GameState } from "./types";



//Create a game for two players and return an instance of game state
export function initGameState(player_id_1 : PlayerId, player_id_2 : PlayerId, Id : number) : GameState{

    let cards : Card[] = [];
    //get a random cards 
    for (let nr_card = 0; nr_card < NUMBER_DIGIT_CARDS_IN_GAME; nr_card++){
        cards.push(ALL_DIGIT_CARDS[Math.floor(Math.random() * ALL_DIGIT_CARDS.length)]);
    }

    for (let nr_card = 0; nr_card < NUMBER_OPERATION_CARDS_IN_GAME; nr_card++){
        cards.push(ALL_OPERATION_CARDS[Math.floor(Math.random() * ALL_OPERATION_CARDS.length)]);
    }


    //Init a game
    let game : GameState = {player1Id : player_id_1, player2Id : player_id_2, player1exp : [1], player2exp : [1], currentTurn : (Math.floor(Math.random() * 2) + 1 as 1 | 2), availableCards : cards, id : Id};

    return game;
}