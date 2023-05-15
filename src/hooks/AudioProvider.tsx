import { createContext, useState } from "react";

const AudioContext = createContext({
  queue: [],
  setQueue: (q: any[]) => { },
  currentSongId: 0,
  setCurrentSongId: (id: number) => { },
  playing: false,
  setPlaying: (playing: boolean) => { },
  listening: false,
  setListening: (listening: boolean) => { },
  initializeSpace: (spaceId: string) => { },
});

const AudioProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentSongId, setCurrentSongId] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const initializeSpace = async (spaceId: string) => {
    //get queue from server
    setError(false);
    setLoading(true);
    setPlaying(false);
    setCurrentSongId(0);
    setListening(false);
    const serverQueue = await getQueue(spaceId);
    if (serverQueue.error) {
      setError(true);
    } else {
      setQueue(serverQueue);
    }
    setLoading(false);
  };

  async function getQueue(spaceId: string) {
    try {
      const res = await fetch(`http://localhost:3001/${spaceId}`).then(res => res.json());
      console.log(res);
      return res;
    } catch (e) {
      return { error: 'failed to get queue' };
    }
  }

  return (
    <AudioContext.Provider value={{ initializeSpace, queue, setQueue, currentSongId, setCurrentSongId, playing, setPlaying, listening, setListening }}>
      {children}
    </AudioContext.Provider>
  );
};

export {
  AudioProvider,
  AudioContext
};