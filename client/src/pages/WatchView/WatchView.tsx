import {useEffect,useRef,useState} from"react";
import styles from"./WatchView.module.css";
import buttonStyle from "../../styles/button1.module.css";
import socket from"../../socket";
import type{Card,GameState,Expression} from"shared";
import{evaluateExpression}from"shared";
import RenderPlayerCards from"../../components/RenderPlayerCards/RenderPlayerCards";
import RenderAvailableCards from"../../components/RenderAvailableCards/RenderAvailableCards";
import Alert from"../../components/Alert/Alert";
import ScoreModal2 from "../../components/ScoreModal2/ScoreModal2";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";



function WatchView(){
  const[game,setGame]=useState<GameState>();
  const[gameId,setGameId]=useState<string>();
  const gameIdRef=useRef<string|undefined>(undefined);

  const[showAlert,setShowAlert] = useState(false);
  const[winner,setWinner]=useState<{result:"win"|"lose"|"draw";player1:number;player2:number}|null>(null);

  const[availableCards,setAvailableCards]=useState<Card[]>([]);
  const[cards1,setCards1]=useState<Card[]>([]);
  const[cards2,setCards2]=useState<Card[]>([]);

  const[turn,setTurn]=useState(1);
  const[player1Id,setPlayer1Id]=useState("");
  const[player2Id,setPlayer2Id]=useState("");

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(()=>{gameIdRef.current=gameId;},[gameId]);

  useEffect(()=>{
    socket.emit("get-game");


    const h=(d:{game_id?:string;game:GameState})=>{
      if (!d) return;

      const{game_id,game}=d;
      console.log(game_id, game);

      setGame(game);
      setGameId(game_id);


      if(gameIdRef.current && game_id===undefined){
        setShowAlert(true);
        setTimeout(()=>setShowAlert(false),4000);
      }


    };

    socket.on("update-state",h);
    return()=>{
      socket.off("update-state",h);
    };
  },[]);

  useEffect(()=>{
    if(!game)return;
    console.log(game, cards2);

    setCards1(game.player1exp);
    setCards2(game.player2exp);
    setAvailableCards(game.availableCards);
    setTurn(game.currentTurn);
    setPlayer1Id(game.player1Id);
    setPlayer2Id(game.player2Id);
    setWinner(null);
  },[game]);

  useEffect(()=>{
    if(game && availableCards.length===0){
      const player1Score = evaluateExpression(cards1 as Expression);
      const player2Score = evaluateExpression(cards2 as Expression);
      const res = player1Score > player2Score ? "win" : player1Score < player2Score ? "lose" : "draw";
      setWinner({result:res, player1:player1Score, player2:player2Score});
      socket.emit("delete-game");
    }
  },[availableCards,cards1,cards2]);



  return(
    <div className={`${styles.container} ${buttonStyle}`}>
      {showAlert && <Alert message={t("watch.alertPlayerLeft")} deleteMessage={() => setShowAlert(false)} />}
      {!game ? (
        <>
          <Link to="/rooms">{t('watch.joinRoomFirst')}</Link>
        </>
      ) : (
        <>
          {winner && <ScoreModal2 result={winner.result} player1={winner.player1} player2={winner.player2} onClose={() => { setWinner(null); setGame(undefined); }} />}
          <div className={styles.player2}>
            <div className={styles.leftInfo}>{t('watch.player2Cards')} ({player2Id})</div>
            <div className={styles.cards}><RenderPlayerCards cards={cards2} droppableType="enemy" /></div>
            <div className={styles.rightInfo}>{t('watch.player2Score')}: {evaluateExpression(cards2)}</div>
          </div>
          <div className={styles.middle}>
            <div className={styles.leftInfo}>{t('watch.turn', { num: turn })}</div>
            <div className={styles.available}>
              <RenderAvailableCards cards={availableCards} />
            </div>
            <div className={styles.rightInfo}>
              <button onClick={() => { socket.emit("stop-watch"); navigate("/rooms") }}>{t('watch.leaveGame')}</button>
            </div>
          </div>
          <div className={styles.player1}>
            <div className={styles.leftInfo}>{t('watch.player1Cards')} ({player1Id})</div>
            <div className={styles.cards}><RenderPlayerCards cards={cards1} droppableType="my" /></div>
            <div className={styles.rightInfo}>{t('watch.player1Score')}: {evaluateExpression(cards1)}</div>
          </div>
        </>
      )}

    </div>
  );
}
export default WatchView;
