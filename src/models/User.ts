import {Schema, Document, model, Model} from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
    username: {type: String, required: true},
    password: {type: String, required: true},
});

export const User: Model<IUser> = model<IUser>('User', userSchema);
