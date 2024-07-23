import {Schema, Document, model, Model} from 'mongoose';

export interface IPlayer extends Document {
    userId: Schema.Types.ObjectId;
    name: string;
    balance: number;
}

const playerSchema: Schema<IPlayer> = new Schema<IPlayer>({
    userId: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    balance: {type: Number, required: true},
});

export const Player: Model<IPlayer> = model<IPlayer>('Player', playerSchema);
