'use client';

import { useState, useEffect } from 'react';
import { isMealAvailable, type MealType } from '@/lib/openingHours';

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

function toISO(year: number, month: number, day: number): string {
  const d = new Date(year, month, day);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function getMonthDays(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  const daysInMonth = last.getDate();
  const startWeekday = (first.getDay() + 6) % 7;
  const result: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) result.push(null);
  for (let d = 1; d <= daysInMonth; d++) result.push(d);
  return result;
}

type Props = {
  value: string;
  onChange: (isoDate: string) => void;
  mealType: MealType;
  minDate?: string;
  maxDate?: string;
  theme: {
    label: string;
    labelMuted: string;
    day: string;
    dayDisabled: string;
    daySelected: string;
    dayToday: string;
    nav: string;
  };
};

export default function BookingCalendar({
  value,
  onChange,
  mealType,
  minDate = todayISO(),
  maxDate,
  theme,
}: Props) {
  const today = todayISO();
  const [viewDate, setViewDate] = useState(() => {
    if (value) return value.slice(0, 7);
    return today.slice(0, 7);
  });
  useEffect(() => {
    if (value) setViewDate(value.slice(0, 7));
  }, [value]);
  const [year, month] = viewDate.split('-').map(Number);
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });

  const canPrev = () => {
    const min = minDate.slice(0, 7);
    return `${year}-${String(month).padStart(2, '0')}` > min;
  };
  const canNext = () => {
    if (!maxDate) return true;
    const max = maxDate.slice(0, 7);
    return `${year}-${String(month).padStart(2, '0')}` < max;
  };
  const goPrev = () => {
    const d = new Date(year, month - 1, 0);
    setViewDate(toISO(d.getFullYear(), d.getMonth(), 1).slice(0, 7));
  };
  const goNext = () => {
    const d = new Date(year, month, 1);
    setViewDate(toISO(d.getFullYear(), d.getMonth(), 1).slice(0, 7));
  };

  const days = getMonthDays(year, month - 1);
  const maxIso = maxDate ?? (() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d.toISOString().slice(0, 10);
  })();

  return (
    <div className="booking-calendar">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canPrev()}
          aria-label="Mese precedente"
          className={`p-2 lg:p-2.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 ${theme.nav}`}
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className={`text-sm lg:text-base font-medium capitalize ${theme.label}`} aria-live="polite">
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={!canNext()}
          aria-label="Mese successivo"
          className={`p-2 lg:p-2.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 ${theme.nav}`}
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 lg:gap-1.5 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className={`text-xs lg:text-sm font-medium ${theme.labelMuted} py-1`}>
            {label}
          </span>
        ))}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }
          const iso = toISO(year, month - 1, day);
          const isPast = iso < today;
          const isAfterMax = iso > maxIso;
          const available = isMealAvailable(iso, mealType);
          const disabled = isPast || isAfterMax || !available;
          const isSelected = value === iso;
          const isToday = iso === today;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onChange(iso)}
              aria-label={disabled ? `${day} non disponibile` : `Scegli ${day}`}
              aria-pressed={isSelected}
              className={`
                min-h-[44px] lg:min-h-[48px] w-full rounded-xl text-sm lg:text-base font-medium transition-all touch-manipulation
                focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
                ${disabled ? theme.dayDisabled : isSelected ? theme.daySelected : isToday ? theme.dayToday : theme.day}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

