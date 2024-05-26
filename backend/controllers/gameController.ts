import { Server, Socket } from 'socket.io';
import { Card, Deck, GameState } from '../types';
import CardModel, { ICard } from '../models/Card';
import DeckModel, { IDeck } from '../models/Deck';

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];

const createDeck = async (): Promise<Deck> => {
  const cards: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      const card: ICard = new CardModel({ suit, value });
      await card.save();
      cards.push(card.toObject() as Card); // Convert Mongoose document to plain object
    }
  }
  const deck = new DeckModel({ cards });
  await deck.save();
  return { cards };
};

const shuffleDeck = (deck: Deck): Deck => {
  for (let i = deck.cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]];
  }
  return deck;
};

export const startGame = async (io: Server, socket: Socket): Promise<void> => {
  let deck = await createDeck();
  deck = shuffleDeck(deck);
  const playerHand: Card[] = [deck.cards.pop()!, deck.cards.pop()!];
  const dealerHand: Card[] = [deck.cards.pop()!, deck.cards.pop()!];

  const gameState: GameState = { playerHand, dealerHand, deck };
  socket.emit('gameStarted', gameState);
};
