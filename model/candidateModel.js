const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    party: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            votedAt: {
                type: Date,
                default: Date.now(),
            },
        }
    ],
    voteCount: {
        type: Number,
        default:0,
    },
});

const candidate = mongoose.model("candidate", candidateSchema);
module.exports = candidate;