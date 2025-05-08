import './globals.css';

import GameContainer from './components/GameContainer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-blue-900">
      <h1 className="text-3xl font-bold text-white mb-4">Big Fish Eat Small Fish</h1>
      <GameContainer />
    </main>
  );
}