export type PlayerId = string;

export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Operation = "*" | "/" | "+" | "-";

export type Card = Digit | Operation;

export type Expression = Card[];

export type Room = {
  name : string;
  gameId? : number;
  player1 : string;
  player2? : string;
  playersNum : number;
}

export interface GameState {
  player1exp: Expression;
  player2exp: Expression;
  player1Id: PlayerId;
  player2Id: PlayerId;
  currentTurn: 1 | 2;
  availableCards: Card[];
  id : number;
}
