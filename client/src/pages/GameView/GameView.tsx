import { useEffect, useRef, useState } from "react";
import styles from "./GameView.module.css";
import socket from "../../socket";
import type { GameState, Card } from "shared";
import Alert from "../../components/Alert/Alert";
import Cards from "../../components/Cards/Cards";

function GameView() {
  const [game, setGame] = useState<GameState | undefined>(undefined);
  const [gameId, setGameId] = useState<number | undefined>(undefined);
  const gameIdRef = useRef<number | undefined>(undefined);
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    gameIdRef.current = gameId;
  }, [gameId]);


  useEffect(() => {
    const handler = (data: { game_id?: number; game: GameState }) => {
      const { game_id, game } = data || {};

      setGame(game);


      if (gameIdRef.current && game_id === undefined) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }

      setGameId(game_id);
    };

    socket.on("update-state", handler);

    return () => {
      socket.off("update-state", handler);
    };
  }, []);

  if (!game) {
    return (
      <>
        <div className={styles.container}>Waiting for the opponent...</div>
        {showAlert && (
          <Alert
            message="Drugi gracz opuścił grę!"
            deleteMessage={() => setShowAlert(false)}
          />
        )}
      </>
    );
  }


  const myPlayerNumber = socket.id === game.player1Id ? 1 : 2;
  
  let myCards: Card[] = [];
  if (myPlayerNumber === 1) myCards = game.player1exp;
  else myCards = game.player2exp;

  let enemyCards: Card[] = [];
  if (myPlayerNumber === 1) enemyCards = game.player2exp;
  else myCards = game.player1exp;

  const availableCards: Card[] = game.availableCards;

  return (
    <div className={styles.container}>
      <div className={styles.enemies}>
        <Cards cards={enemyCards} />
      </div>

      <div className={styles.middle}>

        <div className={styles.leftInfo}>
            {myPlayerNumber === game.currentTurn ? "Your turn" : "Opponent's turn"}
        </div>

        <div className={styles.available}>
          <Cards cards={availableCards} />
        </div>

        <div className={styles.rightInfo}>
           
        </div>
      </div>

      <div className={styles.mine}>
        <Cards cards={myCards} />
      </div>
    </div>
  );
}

export default GameView;
