# Spotify Visualizer

Audio visualizer of Spotify songs using WebGL

By Ben Holmes and Michael Chen

## Getting started

```
npm install
npm run build
npm start
```

Copy `.env2` into a new `.env` file and replace the mongoDB <password> with the appropriate one.

Create a Spotify developer application and replace SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET. Our developer application for this project can be found [here](https://developer.spotify.com/dashboard/applications/79c0dd6a3acc4717b59077af89aa572c).

We're using the following mongoDB Atlas cluster (ask to be added as a collaborator):

https://cloud.mongodb.com/v2/5e268a4d014b7621cd6a2bc3#clusters/connect?clusterId=Cluster0

Whitelist your connection IP address.

## References

- https://github.com/microsoft/TypeScript-Node-Starter/
- https://stackoverflow.com/questions/11375070/pushing-to-github-after-a-shallow-clone
- https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type
- https://medium.com/@tomanagle/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722
- https://pawelgrzybek.com/typescript-interface-vs-type/
- https://github.com/thelinmichael/spotify-web-api-node
