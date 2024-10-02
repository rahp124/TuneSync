require('dotenv').config(); 

const express = require('express');
const spotifyRoutes = require('./routes/spotify');
const youtubeRoutes = require('./routes/youtube');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/spotify', spotifyRoutes);
app.use('/youtube', youtubeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
