import React from "react";
import type { Card } from "shared";
import styles from "../../styles/card.module.css";

type Props = {
  cards: Card[];
};

function RenderAvailableCards({ cards }: Props) {
   if (!cards || cards.length === 0) {
    return <p>Brak kart</p>;
  }
  return (
    <div>
      <ul className={styles.card_list}>
        {cards.map((card, i) => (
          <li key={i} className={styles.card}>
            {card}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RenderAvailableCards;
