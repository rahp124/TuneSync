import axios from 'axios';

export const fetchSpotifyData = async (token) => {
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        time_range: 'long_term',
        limit: 20,
      },
    });
  
    const tracks = response.data.items;
    const genres = [];
  
    // Extract genres from the artists for each track
    for (const track of tracks) {
      const artistIds = track.artists.map(artist => artist.id);
      
      // Get artist genres
      for (const artistId of artistIds) {
        const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        genres.push(...artistResponse.data.genres);
      }
    }
  
    return { tracks, genres };
  };
  

  export const fetchYoutubeData = async (token) => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet,contentDetails',
        maxResults: 10,
        playlistId: 'LL', // Special playlist for liked videos
        access_token: token,
      },
    });
  
    const videos = response.data.items;
    const genres = [];
  
    // For each video, get tags and categories
    for (const video of videos) {
      const videoId = video.contentDetails.videoId;
      const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet',
          id: videoId,
          access_token: token,
        },
      });
  
      const videoData = videoResponse.data.items[0];
      
      // Check if tags are available
      if (videoData.snippet.tags && Array.isArray(videoData.snippet.tags)) {
        genres.push(...videoData.snippet.tags); // Add tags as genres if they exist
      } else {
        console.warn(`No tags found for video ID: ${videoId}`); // Log a warning if no tags found
      }
    }
  
    return { videos, genres };
  };
  

export const fetchUserUploads = async (token) => {
    // Step 1: Get the user's channel ID
    const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'contentDetails',
        mine: true,
        access_token: token,
      },
    });
    
    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
  
    // Step 2: Fetch the uploads using the playlist ID
    const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet',
        maxResults: 10,
        playlistId: uploadsPlaylistId,
        access_token: token,
      },
    });
    
    return videosResponse.data;
  };
  

  // Function to count genre frequencies
export const countGenres = (spotifyGenres, youtubeGenres) => {
    const genreMap = {};
  
    // Count frequency from Spotify genres
    spotifyGenres.forEach(genre => {
      genreMap[genre] = (genreMap[genre] || 0) + 1;
    });
  
    // Count frequency from YouTube tags (used as genres)
    youtubeGenres.forEach(genre => {
      genreMap[genre] = (genreMap[genre] || 0) + 1;
    });
  
    // Sort genres by frequency
    const sortedGenres = Object.entries(genreMap).sort((a, b) => b[1] - a[1]);
  
    return sortedGenres;
  };

  
  export const fetchSpotifyRecommendations = async (token, topGenres) => {
    const genreSeeds = topGenres.slice(0, 5).map(genre => genre[0]); // Use top 5 genres
    const response = await axios.get('https://api.spotify.com/v1/recommendations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        seed_genres: genreSeeds.join(','),
        limit: 10, // Number of recommendations
      },
    });
  
    return response.data.tracks;
  };

  export const fetchYoutubeRecommendations = async (token, topGenres) => {
    const query = topGenres.slice(0, 5).map(genre => genre[0]).join(' '); // Use top genres as query
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query, // Search based on genres
        type: 'video',
        maxResults: 10,
        access_token: token,
      },
    });
  
    return response.data.items;
  };
  

  
