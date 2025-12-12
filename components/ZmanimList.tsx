import React from 'react';
import { ZmanItem } from '../types';
import { formatTime } from '../utils/timeUtils';

interface ZmanimListProps {
  zmanim: ZmanItem[];
  nextZman: ZmanItem | null;
}

export const ZmanimList: React.FC<ZmanimListProps> = ({ zmanim, nextZman }) => {
  return (
    <div className="w-full bg-slate-800/80 backdrop-blur-md border-t-4 border-blue-500 overflow-x-auto pb-4 pt-2">
      <div className="flex flex-row justify-between items-center px-6 min-w-max gap-8 h-24">
        {zmanim.map((zman, index) => {
          const isNext = nextZman?.label === zman.label;
          const isPast = zman.time.getTime() < new Date().getTime();
          
          return (
            <div 
              key={index} 
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-300
                ${isNext ? 'bg-blue-600 scale-110 shadow-lg shadow-blue-500/50 z-10' : 'opacity-70 hover:opacity-100'}
                ${isPast && !isNext ? 'opacity-30 grayscale' : ''}
              `}
            >
              <span className={`text-sm font-tahoma font-bold whitespace-nowrap mb-1 ${isNext ? 'text-white' : 'text-gray-300'}`}>
                {zman.label}
              </span>
              <span className={`text-xl font-tahoma font-bold ${isNext ? 'text-white' : 'text-blue-200'}`}>
                {formatTime(zman.time)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};