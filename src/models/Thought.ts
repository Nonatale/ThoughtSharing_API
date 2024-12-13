import { Schema, Document, model} from 'mongoose';
import { reactionSchema, IReaction } from './Reaction.js';

interface IThought extends Document {
    thoughtText: string;
    username: string;
    createdAt: Date | string;
    reactions: IReaction[];
    __v: number;
    reactionCount: number;
}

const thoughtSchema = new Schema<IThought> (
    {
        thoughtText: {
            type: String,
            required: true,
            maxlength: 280,
            minlength: 1,
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
        reactions: {
            type: [reactionSchema],
            default: [],
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

thoughtSchema
    .virtual('reactionCount')
    .get(function (this: IThought) {
        return this.reactions.length;
    });

const Thought = model('thought', thoughtSchema);

export default Thought;