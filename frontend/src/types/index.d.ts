export interface Card {
  _id: string;
  suit: string;
  value: string;
}

export interface GameState {
  _id: string;
  playerHand: Card[];
  dealerHand: Card[];
  deck: Card[];
  state: 'playing' | 'win' | 'lose' | 'draw' | 'bust';
}
