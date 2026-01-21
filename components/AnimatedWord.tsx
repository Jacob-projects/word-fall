
import React, { useEffect, useState } from 'react';
import { FloatingWord } from '../types';

interface Props {
  word: FloatingWord;
}

const AnimatedWord: React.FC<Props> = ({ word }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, (word.duration + word.delay + 0.5) * 1000);
    return () => clearTimeout(timer);
  }, [word.duration, word.delay]);

  if (!isVisible) return null;

  let animationClass = '';
  const isJacob = word.fontSize.includes('40vw');

  // Dynamic Text Shadow Calculation
  const shadowValue = word.shadowEnabled 
    ? `
      0 0 ${word.shadowIntensity}px ${word.color},
      0 0 ${word.shadowIntensity * 2}px ${word.color}66,
      6px 6px 0px rgba(0,0,0,0.9)
    `
    : 'none';

  let style: React.CSSProperties = {
    position: 'absolute',
    left: `${word.x}%`,
    transform: 'translateX(-50%)',
    fontSize: word.fontSize,
    fontFamily: word.fontFamily,
    fontWeight: 900,
    whiteSpace: 'nowrap',
    textTransform: word.textTransform,
    letterSpacing: '-0.02em',
    lineHeight: 0.8,
    zIndex: isJacob ? 20 : 1,
    opacity: 1,
    color: word.color,
    maxWidth: '100vw', 
    textAlign: 'center',
    textShadow: shadowValue,
  };

  // Behavior Logic
  switch (word.behavior) {
    case 'top-to-bottom':
      animationClass = 'animate-fall';
      break;
    case 'bottom-to-top':
      animationClass = 'animate-rise';
      break;
    case 'background-to-front':
      animationClass = 'animate-zoom-pop';
      style = {
        ...style,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
      };
      break;
    default:
      animationClass = 'animate-fall-random';
      break;
  }

  return (
    <div
      className={`absolute pointer-events-none select-none ${animationClass}`}
      style={{
        ...style,
        animationDuration: `${word.duration}s`,
        animationDelay: `${word.delay}s`,
        animationFillMode: 'forwards',
      }}
    >
      {word.text}
    </div>
  );
};

const Styles: React.FC = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes fall {
      0% { transform: translateY(-120%) translateX(-50%) rotate(-1deg); }
      100% { transform: translateY(110vh) translateX(-50%) rotate(1deg); }
    }
    @keyframes rise {
      0% { transform: translateY(110vh) translateX(-50%) rotate(1deg); }
      100% { transform: translateY(-120%) translateX(-50%) rotate(-1deg); }
    }
    @keyframes fall-random {
      0% { transform: translateY(-120%) translateX(-50%) rotate(-2deg); }
      50% { transform: translateY(50vh) translateX(-48%) rotate(0deg); }
      100% { transform: translateY(110vh) translateX(-50%) rotate(2deg); }
    }
    @keyframes zoom-pop {
      0% { transform: translate(-50%, -50%) scale(0) rotate(-5deg); opacity: 0; }
      15% { opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(10) rotate(5deg); opacity: 0; }
    }

    .animate-fall { animation-name: fall; animation-timing-function: linear; }
    .animate-rise { animation-name: rise; animation-timing-function: linear; }
    .animate-fall-random { animation-name: fall-random; animation-timing-function: ease-in-out; }
    .animate-zoom-pop { animation-name: zoom-pop; animation-timing-function: ease-in; }
  `}} />
);

const AnimatedWordWithStyles: React.FC<Props> = (props) => (
  <>
    <Styles />
    <AnimatedWord {...props} />
  </>
);

export default AnimatedWordWithStyles;
