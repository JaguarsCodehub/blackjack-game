"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = void 0;
const Card_1 = __importDefault(require("../models/Card"));
const Deck_1 = __importDefault(require("../models/Deck"));
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
const createDeck = () => __awaiter(void 0, void 0, void 0, function* () {
    const cards = [];
    for (const suit of suits) {
        for (const value of values) {
            const card = new Card_1.default({ suit, value });
            yield card.save();
            cards.push(card.toObject()); // Convert Mongoose document to plain object
        }
    }
    const deck = new Deck_1.default({ cards });
    yield deck.save();
    return { cards };
});
const shuffleDeck = (deck) => {
    for (let i = deck.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]];
    }
    return deck;
};
const startGame = (io, socket) => __awaiter(void 0, void 0, void 0, function* () {
    let deck = yield createDeck();
    deck = shuffleDeck(deck);
    const playerHand = [deck.cards.pop(), deck.cards.pop()];
    const dealerHand = [deck.cards.pop(), deck.cards.pop()];
    const gameState = { playerHand, dealerHand, deck };
    socket.emit('gameStarted', gameState);
});
exports.startGame = startGame;
