require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error),
  );

// Our routes go here:

app.get('/home', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.q)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artists-search-results', {
        artists: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err),
    );
});

app.get('/albums/:id', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id).then(
    function (data) {
      res.render('albums', {
        albums: data.body.items,
        artist: data.body.items[0].artists[0].name,
      });
      console.log('Album information', data.body);
    },
    function (err) {
      console.error(err);
    },
  );
});

app.get('/albums/tracks/:id', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.id).then(
    function (data) {
      res.render('tracks', { tracks: data.body.items });
      console.log(data.body.items);
    },
    function (err) {
      console.log('Something went wrong!', err);
    },
  );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'),
);
