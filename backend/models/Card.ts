import mongoose, { Document, Schema } from 'mongoose';

export interface ICard extends Document {
  _id: string; // Ensure the _id is typed as string
  suit: string;
  value: string;
}

const cardSchema: Schema = new Schema({
  suit: { type: String, required: true },
  value: { type: String, required: true },
});

export default mongoose.model<ICard>('Card', cardSchema);
