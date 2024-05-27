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
exports.playerStand = exports.playerHit = exports.startGame = void 0;
const Card_1 = __importDefault(require("../models/Card"));
const Game_1 = __importDefault(require("../models/Game"));
const calculateHandValue_1 = require("../utils/calculateHandValue");
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
            cards.push(card);
        }
    }
    return cards;
});
const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};
const startGame = (io, socket) => __awaiter(void 0, void 0, void 0, function* () {
    const deck = shuffleDeck(yield createDeck());
    const playerHand = [deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop()];
    const game = new Game_1.default({
        playerHand,
        dealerHand,
        deck,
        state: 'playing',
    });
    yield game.save();
    const gameState = {
        _id: game._id,
        playerHand,
        dealerHand,
        deck,
        state: game.state,
    };
    console.log('Game started with state:', gameState);
    socket.emit('gameStarted', { gameState });
});
exports.startGame = startGame;
const playerHit = (io, socket, gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield Game_1.default.findById(gameId).populate('deck.cards');
    if (!game)
        return;
    const card = game.deck.pop();
    game.playerHand.push(card);
    yield game.save();
    const playerHandValue = (0, calculateHandValue_1.calculateHandValue)(game.playerHand);
    if (playerHandValue > 21) {
        game.state = 'bust';
        yield game.save();
        socket.emit('gameUpdate', { gameId: game._id, gameState: game });
        console.log('Player busted');
        return;
    }
    socket.emit('gameUpdate', { gameId: game._id, gameState: game });
    console.log('Player hit, new game state:', game);
});
exports.playerHit = playerHit;
const playerStand = (io, socket, gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield Game_1.default.findById(gameId).populate('deck.cards');
    if (!game)
        return;
    while ((0, calculateHandValue_1.calculateHandValue)(game.dealerHand) < 17) {
        const card = game.deck.pop();
        game.dealerHand.push(card);
    }
    const playerHandValue = (0, calculateHandValue_1.calculateHandValue)(game.playerHand);
    const dealerHandValue = (0, calculateHandValue_1.calculateHandValue)(game.dealerHand);
    if (dealerHandValue > 21 || playerHandValue > dealerHandValue) {
        game.state = 'win';
    }
    else if (playerHandValue < dealerHandValue) {
        game.state = 'lose';
    }
    else {
        game.state = 'draw';
    }
    yield game.save();
    socket.emit('gameUpdate', { gameId: game._id, gameState: game });
    console.log('Player stood, final game state:', game);
});
exports.playerStand = playerStand;
