import mongoose from "mongoose";

export type SongDocument = mongoose.Document & {
    id: string;
    votes: number;
};
  
const songSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    faved: {
        type: Boolean,
        default: false
    }
});

songSchema.statics.upvote = async function (songId: string) {
    await this.findOneAndUpdate(
        { "id" : songId }, 
        { $inc: { "votes": 1 } },
        { upsert: true },
    ).exec();
};

songSchema.statics.fave = async function (songId: string) {
    await this.findOneAndUpdate(
        { "id": songId },
        { $set: { "faved": true } },
        { upsert: true },
    ).exec();
};

songSchema.statics.unfave = async function (songId: string) {
    await this.findOneAndUpdate(
        { "id": songId },
        { $set: { "faved": false } },
        { upsert: true },
    ).exec();
};

songSchema.statics.getFaves = async function () {
    await this.find({ saved: true }).exec();
};

export const SongMeta = mongoose.model<SongDocument>("SongMeta", songSchema);