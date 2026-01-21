
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
  const [isRandomSize, setIsRandomSize] = useState(false);
  
  const [wordGap, setWordGap] = useState(300); 
  const [dropDuration, setDropDuration] = useState(8); 
  const [baseFontSize, setBaseFontSize] = useState(25); 

  const inputRef = useRef<HTMLInputElement>(null);
  const laneRef = useRef<number>(0);

  const selectedFont = AVAILABLE_FONTS[fontIndex];

  const cycleFont = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setFontIndex((prev) => (prev + 1) % AVAILABLE_FONTS.length);
    } else {
      setFontIndex((prev) => (prev - 1 + AVAILABLE_FONTS.length) % AVAILABLE_FONTS.length);
    }
  };

  const randomizeCurrentColors = () => {
    setWords((prevWords) => 
      prevWords.map(word => ({
        ...word,
        color: getRandomColor()
      }))
    );
  };

  const spawnWord = useCallback((
    text: string, 
    sequenceIndex: number = 0, 
    fontFamily: string, 
    textTransform: 'uppercase' | 'none',
    sEnabled: boolean,
    sIntensity: number,
    gap: number,
    duration: number,
    bFontSize: number,
    randomSizeActive: boolean
  ) => {
    if (!text.trim()) return;

    const spawnDelay = sequenceIndex * gap; 

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
      
      let currentBaseSize = randomSizeActive 
        ? getRandomInRange(5, 55) 
        : bFontSize + getRandomInRange(-2, 2); 
      
      if (wordLength > 5) {
        currentBaseSize = currentBaseSize * (5 / wordLength);
      }
      
      let fontSize = `${currentBaseSize}vw`; 

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
        duration: behavior === 'background-to-front' ? 3 : duration + getRandomInRange(-0.5, 0.5),
        delay: 0,
        isGradient: false,
        gradientColors: [],
      };

      setWords((prev) => [...prev.slice(-40), newWord]);
    }, spawnDelay);
  }, [baseFontSize, isRandomSize, dropDuration, wordGap, fontIndex, preserveCase, shadowEnabled, shadowIntensity]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const parts = inputValue.split(/\s+/).filter(p => p.length > 0);
      
      if (parts.length > 0) {
        parts.forEach((word, index) => {
          spawnWord(
            word, 
            index, 
            selectedFont.value, 
            preserveCase ? 'none' : 'uppercase', 
            shadowEnabled, 
            shadowIntensity,
            wordGap,
            dropDuration,
            baseFontSize,
            isRandomSize
          );
        });
        setInputValue('');
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white font-mono overflow-hidden select-none">
      <TypographyBackground words={words} />

      {/* Control Container: Positioning adjusted for mobile visibility */}
      <div className="absolute bottom-2 sm:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-2 sm:px-4 z-50 flex flex-col items-center gap-2 sm:gap-6">
        
        {/* Input: even more compact on mobile */}
        <div className="w-full bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 px-4 sm:px-8 py-2.5 sm:py-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] group transition-all hover:bg-white/10">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none text-base sm:text-xl text-center outline-none font-bold placeholder:text-gray-600 transition-colors tracking-[0.1em] text-white"
            placeholder="TYPE SOMETHING..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-4 w-full items-center">
          
          <div className="flex items-center gap-1.5 sm:gap-3 w-full max-w-md">
            {/* Font Carousel: heights and slots reduced further */}
            <div className="flex-1 flex items-center bg-black/40 border border-white/10 backdrop-blur-md rounded-lg sm:rounded-2xl overflow-hidden shadow-xl p-0.5 sm:p-1">
              <button 
                onClick={() => cycleFont('left')}
                className="p-1.5 sm:p-3 hover:bg-white/10 text-white/50 hover:text-white transition-all active:scale-90 z-10"
              >
                <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              <div className="relative flex-1 h-8 sm:h-12 overflow-hidden flex items-center justify-center">
                <div 
                  className="flex transition-transform duration-500 ease-out" 
                  style={{ transform: `translateX(calc(50% - ${fontIndex * 100 + 50}px))` }} // Even narrower slot for mobile
                >
                  {AVAILABLE_FONTS.map((font, idx) => (
                    <div 
                      key={font.name}
                      className={`flex-shrink-0 w-[100px] text-center transition-all duration-300 cursor-pointer ${idx === fontIndex ? 'scale-110 opacity-100' : 'scale-75 opacity-20'}`}
                      style={{ fontFamily: font.value }}
                      onClick={() => setFontIndex(idx)}
                    >
                      <span className="text-[9px] sm:text-[12px] uppercase tracking-widest font-bold whitespace-nowrap">
                        {font.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => cycleFont('right')}
                className="p-1.5 sm:p-3 hover:bg-white/10 text-white/50 hover:text-white transition-all active:scale-90 z-10"
              >
                <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            {/* Size & Random Buttons */}
            <div className="relative group/size flex items-center">
              <div className="p-2 sm:p-4 bg-black/40 border border-white/10 hover:border-white/30 backdrop-blur-md rounded-lg sm:rounded-2xl shadow-xl transition-all cursor-pointer">
                <svg width="18" height="18" className="sm:w-6 sm:h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
                </svg>
              </div>
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 invisible group-hover/size:opacity-100 group-hover/size:visible transition-all flex flex-col items-center gap-2 shadow-2xl min-w-[160px]">
                <div className="w-full flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest font-black text-white/40">Base Size</span>
                  <span className="text-[9px] font-mono text-white">{baseFontSize}vw</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="60" 
                  step="1"
                  disabled={isRandomSize}
                  value={baseFontSize} 
                  onChange={(e) => setBaseFontSize(parseInt(e.target.value))}
                  className={`w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white ${isRandomSize ? 'opacity-30 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <button 
              onClick={randomizeCurrentColors}
              className="p-2 sm:p-4 bg-black/40 border border-white/10 hover:border-white/30 backdrop-blur-md rounded-lg sm:rounded-2xl shadow-xl transition-all active:scale-90 group relative"
            >
              <div className="absolute inset-0 rounded-lg sm:rounded-2xl bg-gradient-to-tr from-cyan-500/10 via-magenta-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg width="18" height="18" className="sm:w-6 sm:h-6 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 1-9 9c-4.5 0-8.3-3.3-8.9-7.6a1 1 0 0 1 .7-1.1c.5-.1 1.1.2 1.2.7.5 3.5 3.6 6 7 6a7 7 0 0 0 7-7c0-1.8-.7-3.4-1.8-4.6l-1.4 1.4c-.6.6-1.7.2-1.7-.7V3.5c0-.3.2-.5.5-.5h5.5c.9 0 1.3 1.1.7 1.7L19.4 6c1.3 1.6 2.1 3.7 2.1 6z"/>
                <path d="M3 12A9 9 0 0 1 12 3c4.5 0 8.3 3.3 8.9 7.6.1.5-.2 1.1-.7 1.2-.5.1-1.1-.2-1.2-.7-.5-3.5-3.6-6-7-6a7 7 0 0 0-7 7c0 1.8.7 3.4 1.8 4.6l1.4-1.4c.6-.6 1.7-.2 1.7.7v5.5c0 .3-.2.5-.5.5H5.1c-.9 0-1.3-1.1-.7-1.7l1.4-1.4C4.5 16.4 3.7 14.3 3 12z"/>
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center px-1">
            <button 
              onClick={() => setPreserveCase(!preserveCase)}
              className={`flex items-center gap-1.5 border border-white/10 backdrop-blur-sm px-2.5 sm:px-4 py-1 sm:py-2 rounded-full shadow-md transition-all group ${preserveCase ? 'bg-white text-black' : 'bg-black/40 text-white'}`}
            >
              <div className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full transition-colors ${preserveCase ? 'bg-black' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'}`} />
              <span className={`text-[7px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold ${preserveCase ? 'text-black' : 'text-white/60 group-hover:text-white'}`}>
                {preserveCase ? 'As Typed' : 'Caps Lock'}
              </span>
            </button>

            <div className="relative group/shadow flex items-center">
              <button 
                onClick={() => setShadowEnabled(!shadowEnabled)}
                className={`flex items-center gap-1.5 border border-white/10 backdrop-blur-sm px-2.5 sm:px-4 py-1 sm:py-2 rounded-full shadow-md transition-all group ${shadowEnabled ? 'bg-white text-black' : 'bg-black/40 text-white'}`}
              >
                <div className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full transition-colors ${shadowEnabled ? 'bg-black' : 'bg-yellow-400 shadow-[0_0_8px_#facc15]'}`} />
                <span className={`text-[7px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold ${shadowEnabled ? 'text-black' : 'text-white/60 group-hover:text-white'}`}>
                  Glow
                </span>
              </button>
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 invisible group-hover/shadow:opacity-100 group-hover/shadow:visible transition-all flex flex-col items-center gap-2 shadow-2xl min-w-[160px]">
                <div className="w-full flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest font-black text-white/40">Intensity</span>
                  <span className="text-[9px] font-mono text-yellow-400">{shadowIntensity}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  value={shadowIntensity} 
                  onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>

            <button 
              onClick={() => setIsRandomSize(!isRandomSize)}
              className={`flex items-center gap-1.5 border border-white/10 backdrop-blur-sm px-2.5 sm:px-4 py-1 sm:py-2 rounded-full shadow-md transition-all group ${isRandomSize ? 'bg-white text-black' : 'bg-black/40 text-white'}`}
            >
              <div className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full transition-colors ${isRandomSize ? 'bg-black' : 'bg-blue-400 shadow-[0_0_8px_#60a5fa]'}`} />
              <span className={`text-[7px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold ${isRandomSize ? 'text-black' : 'text-white/60 group-hover:text-white'}`}>
                Random Size
              </span>
            </button>

            <div className="relative group/gap flex items-center">
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 hover:border-white/20 backdrop-blur-sm px-2.5 sm:px-4 py-1 sm:py-2 rounded-full shadow-md transition-all group">
                <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                <span className="text-[7px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold text-white/60 group-hover:text-white whitespace-nowrap">
                  Gap
                </span>
              </div>
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 invisible group-hover/gap:opacity-100 group-hover/gap:visible transition-all flex flex-col items-center gap-2 shadow-2xl min-w-[160px]">
                <div className="w-full flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest font-black text-white/40">Word Delay</span>
                  <span className="text-[9px] font-mono text-purple-400">{wordGap}ms</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  step="50"
                  value={wordGap} 
                  onChange={(e) => setWordGap(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>

            <div className="relative group/duration flex items-center">
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 hover:border-white/20 backdrop-blur-sm px-2.5 sm:px-4 py-1 sm:py-2 rounded-full shadow-md transition-all group">
                <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-[7px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold text-white/60 group-hover:text-white whitespace-nowrap">
                  Speed
                </span>
              </div>
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 invisible group-hover/duration:opacity-100 group-hover/duration:visible transition-all flex flex-col items-center gap-2 shadow-2xl min-w-[160px]">
                <div className="w-full flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest font-black text-white/40">Drop Time</span>
                  <span className="text-[9px] font-mono text-emerald-400">{dropDuration}s</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="20" 
                  step="0.5"
                  value={dropDuration} 
                  onChange={(e) => setDropDuration(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 border-[12px] sm:border-[20px] border-black pointer-events-none z-40 opacity-50"></div>
      <div className="absolute inset-0 border-[1px] border-white/5 pointer-events-none z-40"></div>
    </div>
  );
};

export default App;
