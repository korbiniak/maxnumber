import styles from "./ScoreModal.module.css";
import { useTranslation } from "react-i18next";

type Props = {
  result: "win" | "lose" | "draw";
  my: number;
  enemy: number;
  onClose: () => void;
};

export default function ScoreModal({ result, my, enemy, onClose }: Props) {
  const { t } = useTranslation();

  const title =
    result === "win"
      ? t("scoreModal.win")
      : result === "lose"
      ? t("scoreModal.lose")
      : t("scoreModal.draw");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.box} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{t("scoreModal.yourScore")}: {my}</p>
        <p>{t("scoreModal.enemyScore")}: {enemy}</p>
        <button className={styles.btn} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
