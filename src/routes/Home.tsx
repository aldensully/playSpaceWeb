import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';
import { apiGetSpaces } from '../api/api';

function Home() {
  const { data: spaces, isLoading, isError } = useQuery(['spaces'], apiGetSpaces);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;

  return (
    <div
      className='w-screen h-screen flex items-center justify-center text-text bg-bg'
    >
      {spaces?.map((space) => (
        <Link key={space.id} to={space.id}>
          <p className='text-text'>{space.name}</p>
        </Link>
      ))}
    </div>
  );
}

export default Home;