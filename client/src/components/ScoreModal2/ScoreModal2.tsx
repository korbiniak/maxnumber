import styles from"./ScoreModal2.module.css";

type Props={result:"win"|"lose"|"draw";player1:number;player2:number;onClose:()=>void};

export default function ScoreModal2({result,player1,player2,onClose}:Props){
  const title=result==="win"?"Player 1 win!":result==="lose"?"Player 2 win!":"Draw!";
  return(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={e=>e.stopPropagation()}>
        <h2>{title}</h2>
        <p>Player 1 score: {player1}</p>
        <p>Player 2 score: {player2}</p>
        <button className={styles.btn} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
