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
    }
});

songSchema.statics.upvote = async function (songId: string) {
    await this.findOneAndUpdate(
        { "id" : songId }, 
        { $inc: { "votes": 1 } },
        { upsert: true },
    ).exec();
};
  
export const SongMeta = mongoose.model<SongDocument>("SongMeta", songSchema);