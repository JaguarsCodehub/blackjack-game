import { Card } from '../types';

export const calculateHandValue = (hand: Card[]): number => {
  let value = 0;
  let aceCount = 0;

  hand.forEach((card) => {
    if (card.value === 'A') {
      aceCount += 1;
      value += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value, 10);
    }
  });

  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount -= 1;
  }

  return value;
};
