const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const router = express.Router();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

router.get('/login', (req, res) => {
  const scope = 'user-top-read'; 
  const authUrl = `https://accounts.spotify.com/authorize?` +
    querystring.stringify({
      client_id: SPOTIFY_CLIENT_ID,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      response_type: 'code',
      scope: scope,
      show_dialog: true,
    });

  res.redirect(authUrl);
});


router.get('/callback', async (req, res) => {
  const { code } = req.query;

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const body = new URLSearchParams({
    code,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  try {
    const response = await axios.post(tokenUrl, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    res.redirect(`http://localhost:3000/?spotify_access_token=${access_token}`);
  } catch (error) {
    console.error('Error fetching Spotify access token:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
