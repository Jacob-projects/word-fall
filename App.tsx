
import React, { useState, useCallback, useRef } from 'react';
import { FloatingWord, WordBehavior } from './types';
import { getRandomColor, getRandomInRange, AVAILABLE_FONTS } from './constants';
import TypographyBackground from './components/TypographyBackground';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [words, setWords] = useState<FloatingWord[]>([]);
  const [fontIndex, setFontIndex] = useState(0);
  const [preserveCase, setPreserveCase] = useState(false);
  const [shadowEnabled, setShadowEnabled] = useState(true);
  const [shadowIntensity, setShadowIntensity] = useState(15);
  const inputRef = useRef<HTMLInputElement>(null);
  const laneRef = useRef<number>(0);

  const selectedFont = AVAILABLE_FONTS[fontIndex];

  const cycleFont = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setFontIndex((prev) => (prev + 1) % AVAILABLE_FONTS.length);
    } else {
      setFontIndex((prev) => (prev - 1 + AVAILABLE_FONTS.length) % AVAILABLE_FONTS.length);
    }
  };

  const spawnWord = useCallback((
    text: string, 
    sequenceIndex: number = 0, 
    fontFamily: string, 
    textTransform: 'uppercase' | 'none',
    sEnabled: boolean,
    sIntensity: number
  ) => {
    if (!text.trim()) return;

    const spawnDelay = sequenceIndex * 2000;

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let behavior: WordBehavior = 'random-fall';

      if (lowerText === "i'm") {
        behavior = 'top-to-bottom';
      } else if (lowerText === "feeling") {
        behavior = 'bottom-to-top';
      } else if (lowerText === "lucky") {
        behavior = 'background-to-front';
      }

      const wordLength = text.length;
      let baseFontSize = getRandomInRange(20, 35); 
      
      if (wordLength > 5) {
        baseFontSize = baseFontSize * (5 / wordLength);
      }
      
      let fontSize = `${baseFontSize}vw`; 

      if (lowerText === 'jacob') {
        fontSize = '40vw'; 
        behavior = 'top-to-bottom';
      }

      const laneX = (laneRef.current % 3) * 20 + 30;
      laneRef.current += 1;

      const color = getRandomColor();

      const newWord: FloatingWord = {
        id: `${Date.now()}-${Math.random()}`,
        text: text,
        x: laneX,
        y: behavior === 'bottom-to-top' ? 150 : -150,
        color: color,
        behavior: behavior,
        fontSize: fontSize,
        fontFamily: fontFamily,
        textTransform: textTransform,
        shadowEnabled: sEnabled,
        shadowIntensity: sIntensity,
        duration: behavior === 'background-to-front' ? 3 : getRandomInRange(6, 10),
        delay: 0,
        isGradient: false,
        gradientColors: [],
      };

      setWords((prev) => [...prev.slice(-30), newWord]);
    }, spawnDelay);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const parts = inputValue.split(/\s+/).filter(p => p.length > 0);
      if (parts.length > 0) {
        parts.forEach((word, index) => {
          spawnWord(word, index, selectedFont.value, preserveCase ? 'none' : 'uppercase', shadowEnabled, shadowIntensity);
        });
        setInputValue('');
      }
    } else if (e.key === ' ') {
      const parts = inputValue.split(/\s+/).filter(p => p.length > 0);
      if (parts.length > 0) {
        spawnWord(parts[parts.length - 1], 0, selectedFont.value, preserveCase ? 'none' : 'uppercase', shadowEnabled, shadowIntensity);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white font-mono overflow-hidden select-none">
      <TypographyBackground words={words} />

      {/* Input UI Container */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50 flex flex-col items-center gap-4">
        
        {/* Main Input Box */}
        <div className="w-full bg-white/10 backdrop-blur-xl rounded-full border border-white/20 px-6 py-3 shadow-[0_0_40px_rgba(0,0,0,0.6)] group transition-all">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none text-lg text-center outline-none font-bold placeholder:text-gray-500 transition-colors tracking-wider text-white"
            placeholder="type here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        {/* Controls Row */}
        <div className="flex flex-col gap-3 w-full items-center">
          {/* Font Selector Overlay */}
          <div className="flex items-center gap-4 bg-black/60 border border-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg">
            <button 
              onClick={() => cycleFont('down')}
              className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            </button>
            
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 w-24 text-center select-none truncate" style={{ fontFamily: selectedFont.value }}>
              {selectedFont.name}
            </div>

            <button 
              onClick={() => cycleFont('up')}
              className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Casing Toggle */}
            <button 
              onClick={() => setPreserveCase(!preserveCase)}
              className="flex items-center gap-2 bg-black/40 border border-white/5 hover:border-white/20 backdrop-blur-sm px-3 py-1 rounded-full shadow-md transition-all group"
            >
              <div className={`w-2 h-2 rounded-full transition-colors ${preserveCase ? 'bg-cyan-400' : 'bg-white/30'}`} />
              <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/50 group-hover:text-white/80">
                {preserveCase ? 'As Typed' : 'All Caps'}
              </span>
            </button>

            {/* Shadow Controls with Intensity Hover */}
            <div className="relative group/shadow flex items-center">
              <button 
                onClick={() => setShadowEnabled(!shadowEnabled)}
                className="flex items-center gap-2 bg-black/40 border border-white/5 hover:border-white/20 backdrop-blur-sm px-3 py-1 rounded-full shadow-md transition-all group"
              >
                <div className={`w-2 h-2 rounded-full transition-colors ${shadowEnabled ? 'bg-yellow-400' : 'bg-white/30'}`} />
                <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-white/50 group-hover:text-white/80">
                  Shadow
                </span>
              </button>
              
              {/* Intensity Slider on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 opacity-0 invisible group-hover/shadow:opacity-100 group-hover/shadow:visible transition-all flex flex-col items-center gap-1 shadow-2xl min-w-[120px]">
                <span className="text-[8px] uppercase tracking-widest font-bold text-white/40">Intensity: {shadowIntensity}px</span>
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  value={shadowIntensity} 
                  onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 border-[1px] border-white/5 pointer-events-none z-40"></div>
    </div>
  );
};

export default App;
