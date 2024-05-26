export interface Card {
  suit: string;
  value: string;
}

export interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  deck: {
    cards: Card[];
  };
}
