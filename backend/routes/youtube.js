const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const router = express.Router();

const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const YOUTUBE_REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI;

router.get('/login', (req, res) => {
  const scope = 'https://www.googleapis.com/auth/youtube.readonly';
  const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
    querystring.stringify({
      client_id: YOUTUBE_CLIENT_ID,
      redirect_uri: YOUTUBE_REDIRECT_URI,
      response_type: 'code',
      scope: scope,
      access_type: 'offline',
      prompt: 'consent',
    });

  res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;

  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const body = new URLSearchParams({
    code,
    client_id: YOUTUBE_CLIENT_ID,
    client_secret: YOUTUBE_CLIENT_SECRET,
    redirect_uri: YOUTUBE_REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  try {
    const response = await axios.post(tokenUrl, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    res.redirect(`http://localhost:3000/?youtube_access_token=${access_token}`);
  } catch (error) {
    console.error('Error fetching YouTube access token:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
