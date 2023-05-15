export type Song = {
  url: string;
  title: string;
  artist: string;
  duration: number;
  thumbnailUri: string;
};

export type Space = {
  id: string;
  name: string;
  queue: Song[];
  state: 'idle' | 'playing' | 'paused';
};

const BASE_URL = 'http://localhost:3001';

export async function getServerSpaceState(spaceId: string): Promise<Space> {
  const response = await fetch(`${BASE_URL}/${spaceId}`);
  const res = await response.json();
  if (res.error) throw new Error(res.error);
  if (!res.space) throw new Error('No space found');
  return res.space;
}

export async function apiAddSong({ songUrl, spaceId }: { songUrl: string; spaceId: string; }): Promise<Song> {
  const res = await fetch(`${BASE_URL}/addSong`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ songUrl, spaceId })
  });
  const data = await res.json();
  if (data.error) throw new Error('Error adding song');
  if (!data.song) throw new Error('No song found');
  return data.song;
}

export async function apiGetSpaces(): Promise<Space[]> {
  const res = await fetch(`${BASE_URL}/spaces`);
  const data = await res.json();
  if (data.error) throw new Error('Error getting spaces');
  if (!data.spaces) throw new Error('No spaces found');
  return data.spaces;
}