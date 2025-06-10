import RenderPlayerCards from "../RenderPlayerCards/RenderPlayerCards";
import type { Card } from "shared";

type Props = {
  cards: Card[];
};

function RenderAvailableCards({ cards }: Props) {
  return <RenderPlayerCards cards={cards} droppableType="available" />;
}

export default RenderAvailableCards;
