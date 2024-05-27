import React, { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { Card, GameState } from '../types';

const Blackjack: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    console.log('Socket.IO client connecting...');

    socket.on('connect', () => {
      console.log('Connected to backend');
    });

    socket.on('gameStarted', ({ gameState }) => {
      // console.log('Game started', gameState);

      setGameState(gameState);
    });

    socket.on('gameUpdate', ({ gameState }) => {
      // console.log('Game updated', gameState);
      setGameState(gameState);
    });

    return () => {
      socket.off('connect');
      socket.off('gameStarted');
      socket.off('gameUpdate');
    };
  }, []);

  const startGame = () => {
    console.log('Starting game...');
    socket.emit('startGame');
  };

  const hit = () => {
    if (gameState) {
      console.log('Player hitting...', { gameId: gameState._id });
      socket.emit('playerHit', { gameId: gameState._id });
    }
  };

  const stand = () => {
    if (gameState) {
      console.log('Player standing...', { gameId: gameState._id });
      socket.emit('playerStand', { gameId: gameState._id });
    }
  };

  return (
    <div>
      <h1>Blackjack</h1>
      {gameState ? (
        <div key={gameState._id}>
          <div key={gameState._id}>
            <h2>Player's Hand</h2>
            {gameState &&
              gameState.playerHand &&
              gameState.playerHand.map((card: Card) => (
                <span key={card._id}>
                  {card.value} of {card.suit},{' '}
                </span>
              ))}
          </div>
          <div>
            <h2>Dealer's Hand</h2>
            {gameState &&
              gameState.playerHand &&
              gameState.dealerHand.map((card: Card) => (
                <span key={card._id}>
                  {card.value} of {card.suit},{' '}
                </span>
              ))}
          </div>
          <button onClick={hit}>Hit</button>
          <button onClick={stand}>Stand</button>
        </div>
      ) : (
        <button onClick={startGame}>Start Game</button>
      )}
    </div>
  );
};

export default Blackjack;
