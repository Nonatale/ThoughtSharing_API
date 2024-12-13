import { Schema, Document, ObjectId, Types } from 'mongoose';

interface IReaction extends Document {
    reactionId: ObjectId,
    reactionBody: string,
    username: string,
    createdAt: Date | string,
}

const reactionSchema = new Schema<IReaction> (
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp: Date | undefined): string => {
                return timestamp
                    ? timestamp.toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                      })
                    : '';
            },
        },
    },
    {
        toJSON: {
            getters: true,
            virtuals: true,
        },
        id: false,
    }
);


export { reactionSchema, IReaction };