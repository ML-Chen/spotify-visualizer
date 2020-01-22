import { Router, Response, Request } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { SongInfo } from "../models/SongInfo";
import { SongMeta } from "../models/SongMeta";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../util/secrets";
import mockSongData from "../models/mockData";

const router = Router();
const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
});
const authorizeURL = spotifyApi.createAuthorizeURL([], "state");

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log("The access token expires in " + data.body["expires_in"]);
    console.log("The access token is " + data.body["access_token"]);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

async function searchTracks(query: string, limit = 4): Promise<SongInfo[]> {
  const spotifyResponse = await spotifyApi.searchTracks(query, { limit: limit });
  console.log(spotifyResponse.body);
  return spotifyResponse.body.tracks.items.map((song: any) => ({
    id: song.id,
    artists: song.artists.map((artist: any) => artist.name),
    imgUrl: song.album.images && song.album.images.length ? song.album.images[song.album.images.length - 1].url : "",
    name: song.name,
    audioUrl: song.preview_url,
  } as SongInfo));
}

async function getTracks(ids: string[]): Promise<SongInfo[]> {
  const spotifyResponse = await spotifyApi.getTracks(ids);
  console.log(spotifyResponse.body);
  return spotifyResponse.body.tracks.map((song: any) => ({
    id: song.id,
    artists: song.artists.map((artist: any) => artist.name),
    imgUrl: song.album.images && song.album.images.length ? song.album.images[song.album.images.length - 1].url : "",
    name: song.name,
    audioUrl: song.preview_url,
  } as SongInfo));
}

router.get("/search", async (req: Request, res: Response) => {
  console.log(req.query);
  if (!req.query || !req.query.query) {
    res.sendStatus(400);
    return;
  }

  const searchQuery = req.query.query;
  const searchResults = await searchTracks(searchQuery);

  res.send(searchResults);
});

router.post("/fave", async (req: Request, res: Response) => {
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

router.post("/upvote", async (req: Request, res: Response) => {
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
  if (!req.query) {
    res.sendStatus(400);
    return;
  }
  
  const favesIds = (SongMeta as any).getFaves(req.query.id);
  const favesInfo = getTracks(favesIds);
  res.send(favesInfo);
  res.sendStatus(200);
});

export default router;