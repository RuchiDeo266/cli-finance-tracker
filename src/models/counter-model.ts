import mongoose, { Schema, Document } from "mongoose";

// Interface for Counter Document
export interface ICounter extends Document {
  _id: string; // Will be set to 'expenseId'
  sequence_value: number;
}

const counterSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sequence_value: {
    type: Number,
    default: 0,
  },
});

const CounterModel = mongoose.model<ICounter>(
  "Counter",
  counterSchema,
  "counters"
);
// Collection name 'counters' is often used
export default CounterModel;
