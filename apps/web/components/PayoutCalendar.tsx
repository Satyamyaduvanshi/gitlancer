'use client';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PayoutCalendar({ bounties = [] }: { bounties?: any[] }) {
  // 🕰️ Time Machine State
  const [referenceDate, setReferenceDate] = useState(new Date());

  const handlePrevWeek = () => {
    const newDate = new Date(referenceDate);
    newDate.setDate(newDate.getDate() - 7);
    setReferenceDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(referenceDate);
    newDate.setDate(newDate.getDate() + 7);
    setReferenceDate(newDate);
  };

  // 🧠 Core Calculation Logic
  const { daysData, weekRangeLabel } = useMemo(() => {
    // 1. Find the Sunday of the current reference week
    const startOfWeek = new Date(referenceDate);
    startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const rangeLabel = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    // 2. Generate the 7 days and calculate their totals
    const weekDays = [];
    const amounts: any[] = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      weekDays.push(currentDay);

      // Sum up all bounties (USDC) distributed on this specific day
      const dailyTotal = bounties.reduce((sum, bounty) => {
        const bountyDate = new Date(bounty.createdAt);
        if (
          bounty.status === 'CLAIMED' && // Only count claimed payouts
          bountyDate.getDate() === currentDay.getDate() &&
          bountyDate.getMonth() === currentDay.getMonth() &&
          bountyDate.getFullYear() === currentDay.getFullYear()
        ) {
          return sum + (bounty.amount || 0);
        }
        return sum;
      }, 0);
      
      amounts.push(dailyTotal);
    }

    // 3. Find the peak day to scale the heights and show the tooltip
    const maxAmount = Math.max(...amounts, 1); // Prevent division by zero
    const peakIndex = amounts.indexOf(Math.max(...amounts.filter(a => a > 0))); // Ignore 0s for peak finding

    // 4. Map everything into the final format for the UI
    const today = new Date();
    const mappedDays = weekDays.map((date, i) => {
      const amount = amounts[i];
      const isPaid = amount > 0;
      
      // Scale height between 40% and 100% based on amount. If unpaid, keep a flat 30% placeholder.
      const heightPct = isPaid ? Math.max((amount / maxAmount) * 100, 40) : 30; 
      
      const isToday = 
        date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear();

      return {
        label: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i],
        dateNum: date.getDate(),
        paid: isPaid,
        height: `${heightPct}%`,
        tooltip: isPaid && i === peakIndex ? `${amount} USDC` : null, // Only show tooltip on the peak day
        isToday
      };
    });

    return { daysData: mappedDays, weekRangeLabel: rangeLabel };
  }, [referenceDate, bounties]);

  return (
    <div className="bg-background rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-black/5 dark:border-white/5 p-6 flex flex-col h-full">
      
      {/* 📅 Header with Navigation Controls */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-foreground text-lg">Payout Calendar</h3>
        
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-full p-1 border border-black/5 dark:border-white/5">
          <button onClick={handlePrevWeek} className="p-1 hover:bg-white dark:hover:bg-black/50 rounded-full transition-colors">
            <ChevronLeft size={14} className="text-foreground/70" />
          </button>
          <span className="text-[10px] font-mono text-foreground/70 tracking-widest uppercase px-1 min-w-[110px] text-center">
            {weekRangeLabel}
          </span>
          <button onClick={handleNextWeek} className="p-1 hover:bg-white dark:hover:bg-black/50 rounded-full transition-colors">
            <ChevronRight size={14} className="text-foreground/70" />
          </button>
        </div>
      </div>
      
      {/* 📊 The Dynamic Chart Area */}
      <div className="flex-1 flex items-end justify-between gap-2 mt-auto pb-2 relative">
        {daysData.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-2 w-full group">
            
            {/* The Pill Bar */}
            <div className="relative w-full max-w-[40px] h-[130px] flex items-end justify-center">
              
              {/* Tooltip for the active peak */}
              {day.tooltip && (
                <div className="absolute -top-8 bg-white dark:bg-carbon border border-black/5 dark:border-white/5 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm text-foreground z-10 whitespace-nowrap animate-in fade-in zoom-in duration-300">
                  {day.tooltip}
                </div>
              )}

              <div 
                style={{ height: day.height }}
                className={`w-full rounded-full transition-all duration-500 ease-out ${
                  day.paid 
                    ? 'bg-persimmon shadow-[0_4px_15px_rgba(252,76,2,0.3)] hover:brightness-110' 
                    : 'bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.05)_4px,rgba(0,0,0,0.05)_8px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.05)_4px,rgba(255,255,255,0.05)_8px)] border border-black/5 dark:border-white/5'
                }`}
              />
            </div>
            
            {/* Day & Date Labels */}
            <div className="flex flex-col items-center mt-1">
              <span className={`text-xs font-mono ${day.isToday ? 'text-persimmon font-bold' : 'text-foreground/40'}`}>
                {day.label}
              </span>
              <span className={`text-[10px] font-mono leading-none mt-1 ${day.isToday ? 'text-persimmon font-bold' : 'text-foreground/30'}`}>
                {day.dateNum}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}