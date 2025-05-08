import React, { useEffect, useState } from "react";
import styles from "./MainView.module.css";
import socket from "../../socket";
import type { GameState, Expression ,SERVER_PORT, PlayerId, Card, NUMBER_DIGIT_CARDS_IN_GAME, ALL_DIGIT_CARDS, NUMBER_OPERATION_CARDS_IN_GAME, ALL_OPERATION_CARDS} from "shared";
import RenderPlayerCards from "../RenderPlayerCards/RenderPlayerCards";;
import RenderAvailableCards from "../RenderAvailableCards/RenderAvailableCards";

function MainView(){
    const [game, setGame] = useState<GameState | undefined>(undefined);
    const [gameId, setGameId] = useState<number>();
    useEffect(() => {
        socket.on("update-state", ({ game_id, game }: { game_id: number; game: GameState }) => {
            setGame(game);
            setGameId(game_id);
        });

        return () => {
            socket.off("update-state");
        };
    }, []);


    if(!game){
        return (
            <div> oczekiwanie na gracza ..</div>
        )
    }
    const myCards: Card[] =
    socket.id === game.player1Id
    ? game.player1exp
    : game.player2exp;

    const enemyCards: Card[] =
    socket.id === game.player1Id
    ? game.player2exp
    : game.player1exp;

    const AvailableCards : Card[] = game.availableCards;

    return (
    <div className={styles.container}> 
        <div className={styles.enemies}>
        <RenderPlayerCards cards={enemyCards} />
        </div>

        <div className={styles.middle}>
            <div className={styles.available}>
                <RenderAvailableCards cards={AvailableCards} />
            </div>
            <div className={styles.middleSpacer}></div>
        </div>

        <div className={styles.mine}>
        <RenderPlayerCards cards={myCards} />
        </div>
    </div>
    );

}

export default MainView;