import { Router, Response, Request } from "express";
import { SongInfo } from "../models/SongInfo";
import { SongMeta } from "../models/SongMeta";
import mockSongData from "../models/mockData";

const router = Router();

router.get("/search", (req: Request, res: Response) => {
  console.log(req.query);
  if (!req.query || !req.query.query) {
    res.sendStatus(400);
    return;
  }

  const searchQuery = req.query.query;

  // TODO: make call to Spotify instead of grabbing sample JSON
  const searchResults: SongInfo[] = mockSongData.map((mockSong: any) => ({
    id: mockSong.id,
    artists: mockSong.artists.map((artist: any) => artist.name),
    imgUrl: mockSong.album.images && mockSong.album.images.length ? mockSong.album.images[mockSong.album.images.length - 1].url : "",
    name: mockSong.name,
    audioUrl: mockSong.preview_url,
  } as SongInfo));

  res.send(searchResults);
});

router.post("/fave",  async (req: Request, res: Response) => {
  console.log(req.query);
  if (!req.query || !req.query.id) {
    res.sendStatus(400);
    return;
  }
  
  const id: string = req.query.id;
  await (SongMeta as any).fave(id);
  res.sendStatus(200);
});

router.post("/unfave",  async (req: Request, res: Response) => {
  console.log(req.query);
  if (!req.query || !req.query.id) {
    res.sendStatus(400);
    return;
  }
  
  const id: string = req.query.id;
  await (SongMeta as any).unfave(id);
  res.sendStatus(200);
});

router.post("/upvote",  async (req: Request, res: Response) => {
  console.log(req.query);
  if (!req.query || !req.query.id) {
    res.sendStatus(400);
    return;
  }
  
  const songId: string = req.query.id;
  await (SongMeta as any).upvote(songId);
  res.sendStatus(200);
});

router.get("/getFaves", async (req: Request, res: Response) => {
  console.log(req.query);
  if (!req.query || !req.query.id) {
    res.sendStatus(400);
    return;
  }
  
  const faves = (SongMeta as any).getFaves(req.query.id);
  // TODO: add song data like artist, etc.
  res.send(faves);
  res.sendStatus(200);
});

export default router;