import React from 'react';
import { ZmanItem } from '../types';

interface CountdownDisplayProps {
  nextZman: ZmanItem | null;
  timeRemaining: string;
}

export const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ nextZman, timeRemaining }) => {
  if (!nextZman) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h1 className="text-4xl font-tahoma font-bold text-gray-400">
          Zmanim terminés pour aujourd'hui
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-pulse-slow">
      <div className="mb-4">
        <span className="text-2xl md:text-3xl font-tahoma font-bold text-yellow-400 tracking-wider uppercase">
          Prochain Zman
        </span>
      </div>
      
      <div className="text-[12vw] leading-none font-tahoma font-bold text-white tabular-nums tracking-tighter shadow-black drop-shadow-2xl">
        {timeRemaining}
      </div>
      
      <div className="mt-6">
        <span className="text-4xl md:text-5xl font-tahoma font-bold text-blue-300">
          {nextZman.label}
        </span>
        <div className="text-2xl mt-2 text-gray-400 font-bold">
            à {nextZman.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};