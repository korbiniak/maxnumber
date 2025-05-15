import { useEffect, useRef, useState } from "react";
import styles from "./GameView.module.css";
import socket from "../../socket";
import type { GameState, Card } from "shared";
import RenderPlayerCards from "../../components/RenderPlayerCards/RenderPlayerCards";
import RenderAvailableCards from "../../components/RenderAvailableCards/RenderAvailableCards";
import Alert from "../../components/Alert/Alert";

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
        <div className={styles.container}>oczekiwanie na gracza ...</div>
        {showAlert && (
          <Alert
            message="Drugi gracz opuścił grę!"
            deleteMessage={() => setShowAlert(false)}
          />
        )}
      </>
    );
  }

  const myCards: Card[] =
    socket.id === game.player1Id ? game.player1exp : game.player2exp;

  const enemyCards: Card[] =
    socket.id === game.player1Id ? game.player2exp : game.player1exp;

  const availableCards: Card[] = game.availableCards;

  return (
    <div className={styles.container}>
      <div className={styles.enemies}>
        <RenderPlayerCards cards={enemyCards} />
      </div>

      <div className={styles.middle}>
        <div className={styles.available}>
          <RenderAvailableCards cards={availableCards} />
        </div>
      </div>

      <div className={styles.mine}>
        <RenderPlayerCards cards={myCards} />
      </div>
    </div>
  );
}

export default GameView;
