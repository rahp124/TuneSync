import React, { useEffect, useState } from 'react';
import { fetchSpotifyData, fetchYoutubeData, fetchSpotifyRecommendations, fetchYoutubeRecommendations, countGenres } from '../api';

const Dashboard = ({ spotifyToken, youtubeToken }) => {
  const [spotifyData, setSpotifyData] = useState([]);
  const [youtubeData, setYoutubeData] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [spotifyRecommendations, setSpotifyRecommendations] = useState([]);
  const [youtubeRecommendations, setYoutubeRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let spotifyRes = { tracks: [], genres: [] };
      let youtubeRes = { videos: [], genres: [] };

      if (spotifyToken) {
        try {
          spotifyRes = await fetchSpotifyData(spotifyToken);
          setSpotifyData(spotifyRes.tracks);
        } catch (error) {
          console.error("Error fetching Spotify data:", error);
        }
      }

      if (youtubeToken) {
        try {
          youtubeRes = await fetchYoutubeData(youtubeToken);
          setYoutubeData(youtubeRes.videos);
        } catch (error) {
          console.error("Error fetching YouTube data:", error);
        }
      }

      if (spotifyToken && youtubeToken) {
        const spotifyGenres = spotifyRes.genres || [];
        const youtubeGenres = youtubeRes.genres || [];
        const genres = countGenres(spotifyGenres, youtubeGenres);
        setTopGenres(genres);

        try {
          const spotifyRec = await fetchSpotifyRecommendations(spotifyToken, genres);
          setSpotifyRecommendations(spotifyRec);
        } catch (error) {
          console.error("Error fetching Spotify recommendations:", error);
        }

        try {
          const youtubeRec = await fetchYoutubeRecommendations(youtubeToken, genres);
          setYoutubeRecommendations(youtubeRec);
        } catch (error) {
          console.error("Error fetching YouTube recommendations:", error);
        }
      }
    };

    fetchData();
  }, [spotifyToken, youtubeToken]);

  const handleSpotifyLogout = () => {
    localStorage.removeItem('spotifyToken');
    setSpotifyData([]);
    window.location.href = '/'; 
  };

  const handleYoutubeLogout = () => {
    localStorage.removeItem('youtubeToken');
    setYoutubeData([]);
    window.location.href = '/'; 
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Display the login buttons conditionally based on token availability */}
      {!spotifyToken && (
        <div>
          <p>You are not logged into Spotify.</p>
          <a href="http://localhost:3001/spotify/login">
            <button>Log into Spotify</button>
          </a>
        </div>
      )}

      {!youtubeToken && (
        <div>
          <p>You are not logged into YouTube.</p>
          <a href="http://localhost:3001/youtube/login">
            <button>Log into YouTube</button>
          </a>
        </div>
      )}

      {/* Display Spotify Data */}
      {spotifyToken && (
        <div>
          <h2>Your Top Played Spotify Tracks:</h2>
          {spotifyData && spotifyData.length > 0 ? (
            <ul>
              {spotifyData.map(track => (
                <li key={track.id}>{track.name} by {track.artists.map(artist => artist.name).join(', ')}</li>
              ))}
            </ul>
          ) : (
            <p>No Spotify data available.</p>
          )}
          <button onClick={handleSpotifyLogout}>Log out of Spotify</button>
        </div>
      )}

      {/* Display YouTube Data */}
      {youtubeToken && (
        <div>
          <h2>Your Liked YouTube Videos:</h2>
          {youtubeData && youtubeData.length > 0 ? (
            <ul>
              {youtubeData.map(video => (
                <li key={video.id}>{video.snippet.title}</li>
              ))}
            </ul>
          ) : (
            <p>No YouTube data available.</p>
          )}
          <button onClick={handleYoutubeLogout}>Log out of YouTube</button>
        </div>
      )}

      {/* Display Top Genres */}
      {topGenres && topGenres.length > 0 ? (
        <div>
          <h2>Your Favorite Genres:</h2>
          <ul>
            {topGenres.map(genre => (
              <li key={genre[0]}>{genre[0]} (Played {genre[1]} times)</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No genre data available.</p>
      )}

      {/* Display Spotify Recommendations */}
      {spotifyRecommendations && spotifyRecommendations.length > 0 ? (
        <div>
          <h2>Recommended Spotify Songs:</h2>
          <ul>
            {spotifyRecommendations.map(track => (
              <li key={track.id}>{track.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No Spotify recommendations available.</p>
      )}

      {/* Display YouTube Recommendations */}
      {youtubeRecommendations && youtubeRecommendations.length > 0 ? (
        <div>
          <h2>Recommended YouTube Videos:</h2>
          <ul>
            {youtubeRecommendations.map(video => (
              <li key={video.id.videoId}>{video.snippet.title}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No YouTube recommendations available.</p>
      )}

      {/* If neither token is present, show a link to the login page */}
      {!spotifyToken && !youtubeToken && (
        <div>
          <p>You are not logged into any service. Please log in to Spotify or YouTube.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
