import mongoose, { Document, Schema } from 'mongoose';
import { ICard } from './Card';

export interface IDeck extends Document {
  cards: ICard[];
}

const deckSchema: Schema = new Schema({
  cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
});

export default mongoose.model<IDeck>('Deck', deckSchema);
