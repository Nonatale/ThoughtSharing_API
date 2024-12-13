import { User, Thought } from '../models/index.js';
import { Request, Response } from 'express';

// get all users
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

// GET a single user by its _id and populated thought and friend data
export const getSingleUser = async (req: Request, res: Response) => {
    try {
        const user = await User.find({ _id: req.params.userId})
            .select('-__v');

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.json(user);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// POST a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

// DELETE to remove user by its _id
// BONUS: Remove a user's associated thoughts when deleted.
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndDelete({_id: req.params.userId});

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'User and associated apps deleted!'})
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// PUT to update a user by its _id
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.json(user);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// /api/users/:userId/friends/:friendId
// add a friend to a user's friend list
export const addFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.json(user);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}


// remove a friend from a user's friend list
export const removeFriend = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.json(user);
        return;
    } catch (err) {
        res.status(500).json(err);
        return;
    }
}

// // add a thought to a user's thought list
// export const addThought = async (req: Request, res: Response) => {
//     try {
//         const thought = await Thought.create(req.body.thoughtText);

//         if (!thought) {
//             return res.status(404).json({ message: 'No thought with that ID' });
//         }

//         const user = await User.findOneAndUpdate(
//             { _id: req.body.userId },
//             { $addToSet: { thoughts: thought._id } },
//             { runValidators: true, new: true }
//         );

//         if (!user) {
//             return res.status(404).json({ message: 'No user with that ID' });
//         }

//         res.json(thought);
//         return;
//     } catch (err) {
//         res.status(500).json(err);
//         return;
//     }
// }

// // remove a thought from a user's thought list
// export const removeThought = async (req: Request, res: Response) => {
//     try {
//         const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

//         if (!thought) {
//             return res.status(404).json({ message: 'No thought with that ID' });
//         }

//         const user = await User.findOneAndUpdate(
//             { _id: req.params.userId },
//             { $pull: { thoughts: req.params.thoughtId } },
//             { runValidators: true, new: true }
//         );

//         if (!user) {
//             return res.status(404).json({ message: 'No user with that ID' });
//         }

//         res.json({ message: 'Thought deleted!'});
//         return;
//     } catch (err) {
//         res.status(500).json(err);
//         return;
//     }
// }