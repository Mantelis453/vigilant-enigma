// app/page.tsx
"use client";
import { useState, useEffect } from 'react';
import GameCard from './components/GameCard';

export default function Home() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      const res = await fetch(`/api/games?search=${search}`);
      const data = await res.json();
      setGames(data);
    };

    const timer = setTimeout(fetchGames, 300); // Debounce
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <main className="min-h-screen bg-[#4518AC] text-white pb-20">
      {/* Navigation / Search Area */}
      <div className="sticky top-0 z-50 bg-[#3f00a5]/90 backdrop-blur-md p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center">
          <h1 className="text-3xl font-black italic tracking-tighter text-white">eneba</h1>
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="split fiction"
              className="w-full bg-[#5200cc] border-none rounded-lg px-12 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-pink-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <p className="text-sm font-bold mb-6">Results found: {games.length}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game: any) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </main>
  );
}