import { Schema, Document, ObjectId, model } from 'mongoose';

interface IUser extends Document {
    thoughts: ObjectId[];
    friends: ObjectId[];
    username: string;
    email: string;
}

const userSchema = new Schema<IUser> (
    {
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, // Regular expression for email validation
                'Please provide a valid email address', // Error message if validation fails
            ],
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

userSchema
    .virtual('friendCount')
    .get(function (this: IUser) {
        return this.friends.length;
    });

const User = model('user', userSchema);

export default User;