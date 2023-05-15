import React from 'react';
import * as THREE from 'three';
import { createContext, Suspense, useContext, useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Html, Preload, OrbitControls } from '@react-three/drei';
import { IconSearch, IconArrowRight, IconArrowLeft, IconChevronDown, IconChevronUp, IconDeviceSpeakerOff, IconMusicOff, IconMusic, IconVolume, IconVolume3, IconVolumeOff } from '@tabler/icons-react';
import { AudioContext } from '../hooks/AudioProvider';
import AudioPlayer from '../components/AudioPlayer';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiAddSong, getServerSpaceState, Song, Space } from '../api/api';

const store = [
  { name: 'outside', color: 'lightpink', position: [10, 0, -15], url: '/fantasy_lands_2.jpg', link: 1 },
  { name: 'inside', color: 'lightblue', position: [15, 0, 0], url: '/fantasy_lands_2.jpg', link: 0 }
];

function Dome({ name, position, texture, onClick }) {
  return (
    <group>
      <mesh>
        <sphereBufferGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function Portals() {
  const [which, set] = useState(0);
  const { link, ...props } = store[which];
  const maps = useLoader(THREE.TextureLoader, store.map((entry) => entry.url)); // prettier-ignore
  return <Dome
    onClick={() => set(link)}
    {...props}
    texture={maps[which]}
  />;
}

function AudioControls() {
  const { listening, setListening } = useContext(AudioContext);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showSlider, setShowSlider] = useState(false);

  const handleMute = (e) => {
    e.preventDefault();
    const audio = document.getElementById('audio') as HTMLAudioElement;
    if (muted) audio.volume = 1;
    else audio.volume = 0;
    setMuted(!muted);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = document.getElementById('audio') as HTMLAudioElement;
    setVolume(Number(event.target.value));
    console.log(event.target.value);
    audio.volume = Number(event.target.value) * 0.01;
    if (audio.volume === 0) setMuted(true);
    else setMuted(false);
  };

  return !listening ? null : (
    <div className='absolute z-100 h-[56px] items-center flex left-[50%] bottom-0 translate-y-[-50%] translate-x-[-50%] text-[white] bg-[rgba(0,0,0,0.6)] rounded-md'>
      <div className='rounded-full p-2 bg-transparent'
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        <button
          onClick={handleMute}
          className='bg-transparent'
        >
          {muted ? <IconVolumeOff size={24} color='white' /> : <IconVolume size={24} color='white' />}
        </button>
        {showSlider && (
          <div className="absolute bottom-12 left-[-60px] w-40 p-2 z-10">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-40"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ListenButton() {
  const { listening, setListening } = useContext(AudioContext);

  const handleClick = (e) => {
    e.preventDefault();
    setListening(true);
  };
  return listening ? null : (
    <button className='absolute z-100 w-[100px] h-[56px] left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] text-[white] bg-[rgba(0,0,0,0.5)] rounded-md' onClick={handleClick}>
      Listen
    </button>
  );
}

function QueueManager({ space }: { space: Space; }) {
  const { listening } = useContext(AudioContext);
  const [value, setValue] = useState('');
  const [queueOpen, setQueueOpen] = useState(false);
  const queryClient = useQueryClient();
  const addSongMutation = useMutation({
    mutationFn: (input: { songUrl: string, spaceId: string; }) => {
      return apiAddSong(input);
    },
    onError: (error, variables, context) => {
      console.log('error: ', error);
    },
    onSettled: (data, error, variables, context) => {
      console.log('settled and data: ', data);
      queryClient.invalidateQueries(['space', space.id]);
    }
  });

  const handleClick = async (e) => {
    e.preventDefault();
    addSongMutation.mutate({ songUrl: value, spaceId: space.id });
  };

  if (!listening) return null;
  if (!space) return null;
  if (!space.queue) return null;

  return (
    <div className='flex flex-col absolute z-[1000] left-4 bottom-4 gap-2 max-w-[380px] w-full'>
      <div className='bg-[rgba(0,0,0,0.8)] pt-2 pb-2 rounded-lg flex flex-col w-full flex-shrink'>
        <div onClick={() => setQueueOpen(!queueOpen)} className='flex flex-row items-center justify-between px-2'>
          <p className='text-text text-sm'>Queue</p>
          <button>
            {queueOpen ?
              <IconChevronDown size={20} stroke={2} color='white' />
              :
              <IconChevronUp size={20} stroke={2} color='white' />
            }
          </button>
        </div>
        <ul className='flex flex-col w-full max-h-[216px] overflow-y-scroll no-scrollbar flex-shrink'>
          {queueOpen && space.queue?.map((song, index) => (
            <li key={song.title} className='flex flex-row items-center justify-between px-2 max-h-[72px] min-h-[72px]'>
              <div className='flex flex-row gap-4'>
                <img src={song.thumbnailUri} className='w-14 h-14 rounded-md' />
                <div className='flex flex-col'>
                  <p className='text-md text-text'>{song.title}</p>
                  <p className='text-sm text-text2'>{song.artist}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          placeholder='Youtube url'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='bg-[rgba(0,0,0,0.6)] outline-none border border-bg text-text text-sm rounded-lg focus:ring-bg focus:border-bg block w-full p-2'
        />
        <button onClick={handleClick}>
          Submit
        </button>
      </div>
    </div>
  );
}




function SpaceRoute() {
  let { spaceId } = useParams();
  const { data: spaceState, isLoading, isError } = useQuery(['space', spaceId], () => getServerSpaceState(spaceId));
  console.log('spaceState', spaceState);
  if (isLoading) return <div>
    <p className='text-black text-lg'>Loading</p>
  </div>;
  if (isError) return <div>Whoops, space not found</div>;
  return (
    <>
      <Canvas frameloop="demand" style={{ height: '100vh', width: '100%', }} camera={{ position: [0, 0, 0.1] }}>
        <OrbitControls autoRotateSpeed={0.6} enableDamping={false} enableRotate={false} enablePan={false} enableZoom={false} autoRotate={true} />
        <Suspense fallback={null}>
          <Portals />
        </Suspense>
      </Canvas>
      <ListenButton />
      {/* <AudioPlayer spaceId={spaceId} /> */}
      {/* <AudioControls /> */}
      <QueueManager space={spaceState} />
    </>
  );
}

export default SpaceRoute;