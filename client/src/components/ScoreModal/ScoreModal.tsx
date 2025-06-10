import styles from"./ScoreModal.module.css";

type Props={result:"win"|"lose"|"draw";my:number;enemy:number;onClose:()=>void};

export default function ScoreModal({result,my,enemy,onClose}:Props){
  const title=result==="win"?"You win!":result==="lose"?"You lose!":"Draw!";
  return(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={e=>e.stopPropagation()}>
        <h2>{title}</h2>
        <p>Your score: {my}</p>
        <p>Enemy score: {enemy}</p>
        <button className={styles.btn} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
