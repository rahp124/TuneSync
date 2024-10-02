import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import './App.css'

function App() {
  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotifyToken'));
  const [youtubeToken, setYoutubeToken] = useState(localStorage.getItem('youtubeToken'));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyAccessToken = params.get('spotify_access_token');
    const youtubeAccessToken = params.get('youtube_access_token');

    if (spotifyAccessToken) {
      setSpotifyToken(spotifyAccessToken);
      localStorage.setItem('spotifyToken', spotifyAccessToken);
      window.history.replaceState({}, document.title, window.location.pathname); // Clean the URL
    }

    if (youtubeAccessToken) {
      setYoutubeToken(youtubeAccessToken);
      localStorage.setItem('youtubeToken', youtubeAccessToken);
      window.history.replaceState({}, document.title, window.location.pathname); // Clean the URL
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Dashboard spotifyToken={spotifyToken} youtubeToken={youtubeToken} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
