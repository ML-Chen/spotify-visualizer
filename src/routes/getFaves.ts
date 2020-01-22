import { Router, Response, Request } from "express";
import { SongMeta } from "../models/SongMeta";

const router = Router();

router.post("/unfave",  async (req: Request, res: Response) => {
  console.log(req.query);
  if (!req.query || !req.query.id) {
    res.sendStatus(400);
    return;
  }
  
  const faves = (SongMeta as any).unfave(req.query.id);
  // TODO: add song data like artist, etc.
  res.send(faves);
  res.sendStatus(200);
});

export default router;