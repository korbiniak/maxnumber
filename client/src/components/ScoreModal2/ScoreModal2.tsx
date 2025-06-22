import styles from "./ScoreModal2.module.css";
import { useTranslation } from "react-i18next";

type Props = {
  result: "win" | "lose" | "draw";
  player1: number;
  player2: number;
  onClose: () => void;
};

export default function ScoreModal2({ result, player1, player2, onClose }: Props) {
  const { t } = useTranslation();

  const title =
    result === "win"
      ? t("scoreModal2.player1Win")
      : result === "lose"
      ? t("scoreModal2.player2Win")
      : t("scoreModal2.draw");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{t("scoreModal2.player1Score")}: {player1}</p>
        <p>{t("scoreModal2.player2Score")}: {player2}</p>
        <button className={styles.btn} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
