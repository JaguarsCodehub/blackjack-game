import mongoose, { Document, Schema } from 'mongoose';
import { ICard } from './Card';

export interface IGame extends Document {
  playerHand: ICard[];
  dealerHand: ICard[];
  deck: ICard[];
  state: 'playing' | 'win' | 'lose' | 'draw' | 'bust';
}

const gameSchema: Schema = new Schema({
  playerHand: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  dealerHand: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  deck: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  state: {
    type: String,
    enum: ['playing', 'win', 'lose', 'draw', 'bust'],
    default: 'playing',
  },
});

export default mongoose.model<IGame>('Game', gameSchema);
