import { Server, Socket } from 'socket.io';
import { Card, GameState } from '../types';
import CardModel, { ICard } from '../models/Card';
import GameModel, { IGame } from '../models/Game';
import { calculateHandValue } from '../utils/calculateHandValue';

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

const createDeck = async (): Promise<ICard[]> => {
  const cards: ICard[] = [];
  for (const suit of suits) {
    for (const value of values) {
      const card: ICard = new CardModel({ suit, value });
      await card.save();
      cards.push(card);
    }
  }
  return cards;
};

const shuffleDeck = (deck: ICard[]): ICard[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const startGame = async (io: Server, socket: Socket): Promise<void> => {
  const deck = shuffleDeck(await createDeck());
  const playerHand = [deck.pop()!, deck.pop()!];
  const dealerHand = [deck.pop()!, deck.pop()!];

  const game = new GameModel({
    playerHand,
    dealerHand,
    deck,
    state: 'playing',
  });
  await game.save();

  const gameState = {
    _id: game._id,
    playerHand,
    dealerHand,
    deck,
    state: game.state,
  };
  console.log('Game started with state:', gameState);
  socket.emit('gameStarted', { gameState });
};

export const playerHit = async (
  io: Server,
  socket: Socket,
  gameId: string
): Promise<void> => {
  const game = await GameModel.findById(gameId).populate('deck.cards');
  if (!game) return;

  const card = game.deck.pop()!;
  game.playerHand.push(card);
  await game.save();

  const playerHandValue = calculateHandValue(game.playerHand);
  if (playerHandValue > 21) {
    game.state = 'bust';
    await game.save();
    socket.emit('gameUpdate', { gameId: game._id, gameState: game });
    console.log('Player busted');
    return;
  }

  socket.emit('gameUpdate', { gameId: game._id, gameState: game });
  console.log('Player hit, new game state:', game);
};

export const playerStand = async (
  io: Server,
  socket: Socket,
  gameId: string
): Promise<void> => {
  const game = await GameModel.findById(gameId).populate('deck.cards');
  if (!game) return;

  while (calculateHandValue(game.dealerHand) < 17) {
    const card = game.deck.pop()!;
    game.dealerHand.push(card);
  }

  const playerHandValue = calculateHandValue(game.playerHand);
  const dealerHandValue = calculateHandValue(game.dealerHand);
  if (dealerHandValue > 21 || playerHandValue > dealerHandValue) {
    game.state = 'win';
  } else if (playerHandValue < dealerHandValue) {
    game.state = 'lose';
  } else {
    game.state = 'draw';
  }

  await game.save();
  socket.emit('gameUpdate', { gameId: game._id, gameState: game });
  console.log('Player stood, final game state:', game);
};
