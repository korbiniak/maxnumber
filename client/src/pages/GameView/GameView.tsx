// src/pages/GameView/GameView.tsx
import {useEffect,useRef,useState} from"react";
import styles from"./GameView.module.css";
import cardStyles from"../../styles/card.module.css";
import socket from"../../socket";
import type{Card,GameState,Expression} from"shared";
import{isExpressionValid,evaluateExpression}from"shared";
import RenderPlayerCards from"../../components/RenderPlayerCards/RenderPlayerCards";
import RenderAvailableCards from"../../components/RenderAvailableCards/RenderAvailableCards";
import Alert from"../../components/Alert/Alert";
import ScoreModal from"../../components/ScoreModal/ScoreModal";
import{DndContext,PointerSensor,closestCenter,useSensor,useSensors,type DragStartEvent,type DragEndEvent,DragOverlay}from"@dnd-kit/core";
import{SortableContext}from"@dnd-kit/sortable";

function GameView(){
  const[game,setGame]=useState<GameState>();
  const[gameId,setGameId]=useState<number>();
  const gameIdRef=useRef<number|undefined>(undefined);

  const[showAlert,setShowAlert] = useState(false);
  const iDeleted = useRef<boolean>(false);
  const[invalidMove,setInvalidMove]=useState(false);
  const[winner,setWinner]=useState<{result:"win"|"lose"|"draw";my:number;enemy:number}|null>(null);

  const[availableCards,setAvailableCards]=useState<Card[]>([]);
  const[myCards,setMyCards]=useState<Card[]>([]);
  const[enemyCards,setEnemyCards]=useState<Card[]>([]);
  const[draggedCard,setDraggedCard]=useState<Card|null>(null);

  const[turn,setTurn]=useState(1);
  const[player1Id,setPlayer1Id]=useState("");
  const[player2Id,setPlayer2Id]=useState("");

  const sensors=useSensors(useSensor(PointerSensor));

  useEffect(()=>{gameIdRef.current=gameId;},[gameId]);

  useEffect(()=>{
    socket.emit("get-game");

    const h=(d:{game_id?:number;game:GameState})=>{
      if (!d) return;

      const{game_id,game}=d;
      setGame(game);
      setGameId(game_id);
      console.log("I deleted", iDeleted);
      if(gameIdRef.current && game_id===undefined && !iDeleted.current){
        setShowAlert(true);
        setTimeout(()=>setShowAlert(false),4000);
      }
      iDeleted.current = false;
    };

    socket.on("update-state",h);
    return()=>{
      socket.off("update-state",h);
    };
  },[]);

  useEffect(()=>{
    if(!game)return;
    const p1=socket.id===game.player1Id;
    setMyCards(p1?game.player1exp:game.player2exp);
    setEnemyCards(p1?game.player2exp:game.player1exp);
    setAvailableCards(game.availableCards);
    setTurn(game.currentTurn);
    setPlayer1Id(game.player1Id);
    setPlayer2Id(game.player2Id);
    setWinner(null);
  },[game]);

  useEffect(()=>{
    if(game && availableCards.length===0){
      const myScore=evaluateExpression(myCards as Expression);
      const enemyScore=evaluateExpression(enemyCards as Expression);
      const res=myScore>enemyScore?"win":myScore<enemyScore?"lose":"draw";
      setWinner({result:res,my:myScore,enemy:enemyScore});
      socket.emit("delete-game");
    }
  },[availableCards,myCards,enemyCards]);

  const isMyTurn=(turn===1&&player1Id===socket.id)||(turn===2&&player2Id===socket.id);

  function handleDragStart(e:DragStartEvent){setDraggedCard(e.active.data.current?.card??null);}

  function handleDragEnd(e:DragEndEvent){
    setDraggedCard(null);
    const{active,over}=e;
    if(!isMyTurn||!over)return;

    const from=active.data.current?.droppable;
    const to=over.data.current?.droppable as"my"|"enemy"|"available"|undefined;
    if(to!=="my"&&to!=="enemy")return;
    if(from!=="available"||!gameId)return;

    const card=active.data.current?.card as Card;
    const srcIdx=active.data.current?.index as number;
    const slotIdx=over.data.current?.slotIndex as number;

    const clone=(arr:Card[])=>{const n=[...arr];n.splice(slotIdx,0,card);return n;};
    const candidate=to==="my"?clone(myCards):clone(enemyCards);

    if(!isExpressionValid(candidate as Expression)){
      setInvalidMove(true);setTimeout(()=>setInvalidMove(false),2000);return;
    }

    setAvailableCards(p=>p.filter((_,i)=>i!==srcIdx));
    to==="my"?setMyCards(candidate):setEnemyCards(candidate);
    socket.emit("move-card",{gameId,target:to,card,index:slotIdx});
  }

  return(
    <div className={styles.container}>
      {showAlert&&<Alert message="Second player left the game!" deleteMessage={()=>setShowAlert(false)}/>}
      {!game?(
        <>
          <div>You have to join a room first</div>
        </>
      ):(
        <>
          {invalidMove&&<Alert message="Invalid expression! Move cancelled." deleteMessage={()=>setInvalidMove(false)}/>}
          {winner&&<ScoreModal result={winner.result} my={winner.my} enemy={winner.enemy} onClose={()=>{setWinner(null); setGame(undefined);}}/>}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={styles.enemies}>
              <RenderPlayerCards cards={enemyCards} droppableType="enemy"/>
            </div>
            <div className={styles.middle}>
              <div className={styles.leftInfo}>{isMyTurn?"Your turn":"Opponent's turn"}</div>
              <div className={styles.available}>
                <SortableContext items={availableCards.map((_,i)=>`available-${i}`)}>
                  <RenderAvailableCards cards={availableCards}/>
                </SortableContext>
              </div>
              <div className={styles.rightInfo}> 
                <button onClick={() => {iDeleted.current = true; socket.emit("delete-game", true);}}>Leave Game</button>
              </div>
            </div>
            <div className={styles.mine}>
              <RenderPlayerCards cards={myCards} droppableType="my"/>
            </div>
            <DragOverlay dropAnimation={null}>
              {draggedCard&&<div className={cardStyles.card}>{draggedCard}</div>}
            </DragOverlay>
          </DndContext>
        </>
      )}
    </div>
  );
}
export default GameView;
