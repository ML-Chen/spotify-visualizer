import { Router, Response, Request } from "express";
import { SongInfo } from "../models/SongInfo";
import mockSongData from "../models/mockData";

const router = Router();

router.get("/upvote", (req: Request, res: Response) => {
  

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

export default router;