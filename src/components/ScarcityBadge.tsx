'use client';

import { useState, useEffect } from 'react';

interface ScarcityBadgeProps {
  totalSpots?: number;
  bookedSpots?: number;
  className?: string;
}

export default function ScarcityBadge({
  totalSpots = 50,
  bookedSpots = 0,
  className = ''
}: ScarcityBadgeProps) {
  const [spots, setSpots] = useState(bookedSpots);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Simulate real-time booking updates (optional)
    const interval = setInterval(() => {
      const randomIncrease = Math.random() > 0.7; // 30% chance
      if (randomIncrease && spots < totalSpots) {
        setSpots(prev => Math.min(prev + 1, totalSpots));
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2000);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [spots, totalSpots]);

  const availableSpots = totalSpots - spots;
  const percentageBooked = (spots / totalSpots) * 100;

  // Determine urgency level
  const getUrgencyColor = () => {
    if (percentageBooked >= 90) return 'bg-rose-600 border-rose-500';
    if (percentageBooked >= 70) return 'bg-amber-600 border-amber-500';
    return 'bg-rose-700 border-rose-600';
  };

  const getUrgencyText = () => {
    if (percentageBooked >= 90) return 'Ultimi posti!';
    if (percentageBooked >= 70) return 'Posti limitati';
    return 'Prenota ora';
  };

  return (
    <div className={`${className}`}>
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getUrgencyColor()} text-white text-sm font-medium shadow-lg ${
          showAnimation ? 'animate-pulse' : ''
        }`}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{getUrgencyText()}</span>
        {availableSpots <= 10 && availableSpots > 0 && (
          <span className="ml-1 font-bold">• Solo {availableSpots} disponibili</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-3 w-full max-w-xs">
        <div className="flex justify-between items-center text-xs text-rose-200/70 mb-1">
          <span>Prenotazioni</span>
          <span>{Math.round(percentageBooked)}% prenotato</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden border border-rose-300/20">
          <div
            className="bg-gradient-to-r from-rose-500 to-rose-600 h-full transition-all duration-1000 ease-out"
            style={{ width: `${percentageBooked}%` }}
          />
        </div>
      </div>
    </div>
  );
}
