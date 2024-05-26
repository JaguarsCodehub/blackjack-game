import React, { useState, useEffect } from 'react';
import socket from '../services/socket';
import { Card, GameState } from '../types';

const Blackjack: React.FC = () => {
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);

  useEffect(() => {
    socket.on('gameStarted', (data: GameState) => {
      setPlayerHand(data.playerHand);
      setDealerHand(data.dealerHand);
    });

    // Clean up on unmount
    return () => {
      socket.off('gameStarted');
    };
  }, []);

  const startGame = () => {
    socket.emit('startGame');
  };

  return (
    <div>
      <h1>Blackjack Game</h1>
      <button onClick={startGame}>Start Game</button>
      <div>
        <h2>Player's Hand</h2>
        {playerHand.map((card, index) => (
          <div key={index}>
            {card.value} of {card.suit}
          </div>
        ))}
      </div>
      <div>
        <h2>Dealer's Hand</h2>
        {dealerHand.map((card, index) => (
          <div key={index}>
            {card.value} of {card.suit}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blackjack;
