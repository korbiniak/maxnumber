import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "shared";
import styles from "../../styles/card.module.css";

type Props = {
  cards: Card[];
  droppableType: "my" | "enemy";
};

function RenderPlayerCards({ cards, droppableType }: Props) {
  return (
    <ul className={styles.card_list}>
      {cards.map((card, index) => (
        <SortableCard
          key={`${droppableType}-${card}-${index}`}
          card={card}
          index={index}
          droppableType={droppableType}
        />
      ))}
      <DropEndPlaceholder type={droppableType} />
    </ul>
  );
}

function SortableCard({
  card,
  index,
  droppableType,
}: {
  card: Card;
  index: number;
  droppableType: "my" | "enemy";
}) {
  const id = `${droppableType}-${card}-${index}`;

  const { setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      droppable: droppableType,
    },
    disabled: true,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className={styles.card}>
      {card}
    </li>
  );
}

function DropEndPlaceholder({ type }: { type: "my" | "enemy" }) {
  const id = `${type}-end`;
  const { setNodeRef, transform, transition } = useSortable({
    id,
    data: { droppable: type },
    disabled: true,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: 0.0,
    border: "1px dashed #aaa",
    height: "40px",
    width: "30px",
    display: "inline-block",
  };

  return <li ref={setNodeRef} style={style}></li>;
}

export default RenderPlayerCards;
