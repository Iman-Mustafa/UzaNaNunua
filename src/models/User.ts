import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  role: 'Seller' | 'Buyer';
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    role: {
      type: String,
      enum: ['Seller', 'Buyer'],
      default: 'Buyer',
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
