import React from 'react';

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <a href="http://localhost:3001/spotify/login">
        <button>Login with Spotify</button>
      </a>
      <a href="http://localhost:3001/youtube/login">
        <button>Login with YouTube</button>
      </a>
      <a href="/">Back to Dashboard</a>
    </div>
  );
};

export default Login;
