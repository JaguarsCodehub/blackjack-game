export interface Card {
  _id: string;
  suit: string;
  value: string;
}

export interface Deck {
  cards: Card[];
}

export interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  deck: Deck;
}
