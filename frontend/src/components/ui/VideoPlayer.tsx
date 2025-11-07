import React from 'react';
import ReactPlayer from 'react-player';

function getPlayableUrl(url: string): string {
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/watch?v=${shortMatch[1]}`;
  }
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/watch?v=${watchMatch[1]}`;
  }
  return url;
}

type VideoPlayerProps = { url: string };

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const playableUrl = getPlayableUrl(url);
  console.log("ReactPlayer loading:", playableUrl);
  // @ts-ignore
  return <ReactPlayer url={playableUrl} controls width="100%" height="360px" />;
};

export default VideoPlayer;
