import { useEffect, useRef, useState } from "react";
import styles from "./GameView.module.css";
import socket from "../../socket";
import type { GameState, Card } from "shared";
import RenderPlayerCards from "../../components/RenderPlayerCards/RenderPlayerCards";
import RenderAvailableCards from "../../components/RenderAvailableCards/RenderAvailableCards";
import Alert from "../../components/Alert/Alert";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

function GameView() {
  const [game, setGame] = useState<GameState | undefined>(undefined);
  const [gameId, setGameId] = useState<number | undefined>(undefined);
  const gameIdRef = useRef<number | undefined>(undefined);
  const [showAlert, setShowAlert] = useState(false);

  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [myCards, setMyCards] = useState<Card[]>([]);
  const [enemyCards, setEnemyCards] = useState<Card[]>([]);
  const [turn , setTurn] = useState<number>(1);
  const [Player1Id , setPlayer1Id] = useState<string>("");
  const [Player2Id , setPlayer2Id] = useState<string>("");

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    gameIdRef.current = gameId;
  }, [gameId]);

  useEffect(() => {
    const handleUpdateState = (data: { game_id?: number; game: GameState }) => {
      const { game_id, game } = data;
      setGame(game);
      setGameId(game_id);
      console.log(" ustawilismy gre na ", game);
      if (gameIdRef.current && game_id === undefined) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3001);
      }
    };
    socket.on("update-state", handleUpdateState);
    return () => void socket.off("update-state", handleUpdateState);
  }, []);

  useEffect(() => {
    if (game) {
      const isPlayer1 = socket.id === game.player1Id;
      setMyCards(isPlayer1 ? game.player1exp : game.player2exp);
      setEnemyCards(isPlayer1 ? game.player2exp : game.player1exp);
      setAvailableCards(game.availableCards);
      setTurn(game.currentTurn);
      setPlayer1Id(game.player1Id);
      setPlayer2Id(game.player2Id);
      //console.log("ustawiamy karty moje i przeciwnika na ", myCards, " i ", enemyCards);
    }
  }, [game]);
    const isMyTurn =  (turn === 1 && Player1Id === socket.id) || (turn === 2 && Player2Id === socket.id);
  function handleDragEnd(event: DragEndEvent) {
    if(!isMyTurn) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const activeCard: Card = active.data.current?.card;
    const overId = over.id;
    const overList = over.data.current?.droppable;

    if (activeType !== "available" || !gameId || !overList) return;

    const updatedAvailable = [...availableCards];
    const activeIndex = updatedAvailable.findIndex((c, i) => `available-${c}-${i}` === active.id);
    if (activeIndex !== -1) {
      updatedAvailable.splice(activeIndex, 1);
      setAvailableCards(updatedAvailable);
    }

    if (overList === "my") {
      const insertIndex =
        overId === "my-end"
          ? myCards.length
          : myCards.findIndex((c, i) => `my-${c}-${i}` === overId);

      const updatedMy = [...myCards];
      const finalIndex = insertIndex !== -1 ? insertIndex : updatedMy.length;
      updatedMy.splice(finalIndex, 0, activeCard);
      setMyCards(updatedMy);

      socket.emit("move-card", {
        gameId,
        target: "my",
        card: activeCard,
        index: finalIndex,
      });
    }

    if (overList === "enemy") {
      const insertIndex =
        overId === "enemy-end"
          ? enemyCards.length
          : enemyCards.findIndex((c, i) => `enemy-${c}-${i}` === overId);

      const updatedEnemy = [...enemyCards];
      const finalIndex = insertIndex !== -1 ? insertIndex : updatedEnemy.length;
      updatedEnemy.splice(finalIndex, 0, activeCard);
      setEnemyCards(updatedEnemy);

      socket.emit("move-card", {
        gameId,
        target: "enemy",
        card: activeCard,
        index: finalIndex,
      });
    }
  }

  const generateKeys = (cards: Card[], prefix: string) =>
    [...cards.map((c, i) => `${prefix}-${c}-${i}`), `${prefix}-end`];


  //console.log(" czy jest moja kolej ?  ", isMyTurn);
  return (
    <div className={styles.container}>
      {!game ? (
        <>
          <div>Waiting for the opponent...</div>
          {showAlert && (
            <Alert
              message="Second player left the game!"
              deleteMessage={() => setShowAlert(false)}
            />
          )}
        </>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className={styles.enemies}>
            <SortableContext items={generateKeys(enemyCards, "enemy")} strategy={rectSortingStrategy}>
              <RenderPlayerCards cards={enemyCards} droppableType="enemy" />
            </SortableContext>
          </div>

          <div className={styles.middle}>
            <div className={styles.leftInfo}>
              {isMyTurn ? "Your turn" : "Opponent's turn"}
            </div>

            <div className={styles.available}>
              <RenderAvailableCards cards={availableCards} />
            </div>

            <div className={styles.rightInfo}></div>
          </div>

          <div className={styles.mine}>
            <SortableContext items={generateKeys(myCards, "my")} strategy={rectSortingStrategy}>
              <RenderPlayerCards cards={myCards} droppableType="my" />
            </SortableContext>
          </div>
        </DndContext>
      )}
    </div>
  );
}

export default GameView;
