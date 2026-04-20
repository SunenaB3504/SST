import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PipState = 'happy' | 'thinking' | 'eco-warrior' | 'excited';

export interface PipThePuppyProps {
  state?: PipState;
  message?: string;
  className?: string;
}

export const PipThePuppy: React.FC<PipThePuppyProps> = ({ state = 'happy', message, className }) => {
  const stateEmoji = {
    happy: '🐶',
    thinking: '🤔',
    'eco-warrior': '🌿🐶',
    excited: '🤩',
  };

  const bubbleColors = {
    happy: 'bg-purple-100 text-purple-900 border-purple-200',
    thinking: 'bg-blue-50 text-blue-900 border-blue-100',
    'eco-warrior': 'bg-green-50 text-green-900 border-green-100',
    excited: 'bg-yellow-50 text-yellow-900 border-yellow-100',
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        {/* Animated Background Rings */}
        <div className="absolute inset-0 bg-purple-200 rounded-full scale-125 opacity-20 animate-pulse" />
        
        {/* Mascot Face */}
        <div className="relative w-32 h-32 bg-white rounded-4xl shadow-soft flex items-center justify-center text-6xl border-2 border-purple-50 animate-bounce-subtle">
           <span role="img" aria-label="Pip the Puppy">
             {stateEmoji[state]}
           </span>
        </div>
      </div>

      {message && (
        <div className={cn(
          'px-6 py-3 rounded-2xl font-bold border-2 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500',
          bubbleColors[state]
        )}>
          {message}
        </div>
      )}
    </div>
  );
};
