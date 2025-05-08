import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "shared";
import styles from "../../styles/card.module.css";

type DroppableType = "my" | "enemy" | "available";

type Props = {
  cards: Card[];
  droppableType: DroppableType;
};

function SortableAvailableCard({
  card,
  index,
}: {
  card: Card;
  index: number;
}) {
  const id = `available-${index}`;

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id,
    data: { droppable: "available", card, index },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={styles.card}
      {...attributes}
      {...listeners}
    >
      {card}
    </li>
  );
}

function DropSlot({
  listType,
  slotIndex,
}: {
  listType: "my" | "enemy";
  slotIndex: number;
}) {
  const id = `${listType}-slot-${slotIndex}`;
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { droppable: listType, slotIndex },
  });

  return (
    <li
      ref={setNodeRef}
      className={styles.slot}
      data-over={isOver}
    />
  );
}

function RenderPlayerCards({ cards, droppableType }: Props) {
  if (droppableType === "available") {
    return (
      <ul className={styles.card_list}>
        {cards.map((card, i) => (
          <SortableAvailableCard key={i} card={card} index={i} />
        ))}
      </ul>
    );
  }

  return (
    <ul className={styles.card_list}>
      <DropSlot listType={droppableType} slotIndex={0} />
      {cards.map((card, i) => (
        <React.Fragment key={i}>
          <li className={styles.card}>{card}</li>
          <DropSlot listType={droppableType} slotIndex={i + 1} />
        </React.Fragment>
      ))}
    </ul>
  );
}

export default RenderPlayerCards;
