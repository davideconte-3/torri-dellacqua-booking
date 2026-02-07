'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string; // ISO format: "2026-02-14"
  className?: string;
}

export default function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl md:text-3xl font-bold text-rose-200 tabular-nums">
          {timeLeft.days}
        </span>
        <span className="text-xs text-rose-300/70 uppercase">giorni</span>
      </div>
      <span className="text-rose-300/40">:</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl md:text-3xl font-bold text-rose-200 tabular-nums">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-xs text-rose-300/70 uppercase">ore</span>
      </div>
      <span className="text-rose-300/40">:</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl md:text-3xl font-bold text-rose-200 tabular-nums">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-xs text-rose-300/70 uppercase">min</span>
      </div>
    </div>
  );
}
