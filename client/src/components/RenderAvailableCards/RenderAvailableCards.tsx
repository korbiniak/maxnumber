import React from "react";
import { useDraggable } from "@dnd-kit/core";
import type { Card } from "shared";
import styles from "../../styles/card.module.css";

type Props = {
  cards: Card[];
};

function RenderAvailableCards({ cards }: Props) {
  if (!cards || cards.length === 0) {
    return <p>No cards left !</p>;
  }

  return (
    <ul className={styles.card_list}>
      {cards.map((card, index) => (
        <DraggableCard key={`available-${card}-${index}`} card={card} index={index} />
      ))}
    </ul>
  );
}

function DraggableCard({ card, index }: { card: Card; index: number }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `available-${card}-${index}`,
    data: {
      type: "available",
      card,
    },
  });

  const style = {
    transform: `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`,
  };

  return (
    <li ref={setNodeRef} style={style} {...listeners} {...attributes} className={styles.card}>
      {card}
    </li>
  );
}

export default RenderAvailableCards;
