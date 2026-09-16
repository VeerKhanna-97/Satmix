import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceFrame, setDeviceFrame, colors } = useApp();

  if (deviceFrame === 'full') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center transition-colors" style={{ backgroundColor: colors.bg }}>
      {/* Device Frame Top Controls */}
      <div className="mb-4 flex items-center gap-3 px-4 py-2 rounded-2xl shadow-xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
        <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>Previewing: iPhone 16 Pro Mockup (393 × 852)</span>
        <button
          onClick={() => setDeviceFrame('full')}
          className="text-xs font-bold hover:underline flex items-center gap-1 pl-2 border-l"
          style={{ borderColor: colors.borderDim, color: colors.accent }}
        >
          <Monitor className="w-3.5 h-3.5" /> Full Width
        </button>
      </div>

      {/* iPhone 16 Pro Mockup Container */}
      <div className="relative w-[393px] h-[852px] rounded-[52px] bg-[#090A0E] border-[10px] border-[#1C1E2A] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col">
        {/* Dynamic Island Notch */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-neutral-800" />
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }} />
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto pt-8 pb-4 relative select-none">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
