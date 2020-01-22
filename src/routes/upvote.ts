import { Router, Response, Request } from "express";
import { SongInfo } from "../models/SongInfo";
import { SongMeta } from "../models/SongMeta";

const router = Router();

router.get("/upvote", (req: Request, res: Response) => {
  console.log(req.query);
  if (!req.query || !req.query.query) {
    res.sendStatus(400);
    return;
  }
  
  const songId: string = req.query.songId;
  await SongMeta.upvote(songId);
  res.sendStatus(200);
});

export default router;