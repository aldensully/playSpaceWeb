import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';


const AudioPlayer = ({ spaceId }: { spaceId: string; }) => {
  const audioRef = useRef<HTMLMediaElement>(null);
  const url = `http://localhost:3001/${spaceId}/stream.m3u8`;

  useEffect(() => {
    let hls: Hls;

    const audio = audioRef.current;
    if (!audio) return;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(audio);
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = url;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url]);

  // const url = "http://23.22.40.232:3000/"
  return (
    <audio controls ref={audioRef} id='audio' autoPlay />
  );
};

export default AudioPlayer;
