import { Route, Routes } from 'react-router-dom';
import Space from './routes/Space';
import { AudioProvider } from './hooks/AudioProvider';
import Home from './routes/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:spaceId" element={<Space />} />
        </Routes>
      </AudioProvider>
    </QueryClientProvider>
  );
}

