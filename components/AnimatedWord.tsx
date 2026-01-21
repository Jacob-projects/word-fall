
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
    }, (word.duration + word.delay + 0.1) * 1000);
    return () => clearTimeout(timer);
  }, [word.duration, word.delay]);

  if (!isVisible) return null;

  let animationClass = '';
  const isJacob = word.fontSize.includes('40vw');

  const intensity = Math.min(Math.max(word.shadowIntensity, 5), 40);
  const responsiveIntensity = intensity * 0.1; 

  const shadowValue = word.shadowEnabled 
    ? `
      0 0 ${responsiveIntensity}vw ${word.color},
      0 0 ${responsiveIntensity * 1.5}vw ${word.color}88,
      0.5vw 0.5vw 0.1vw rgba(0,0,0,0.8)
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
    willChange: 'transform, opacity', 
  };

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
      0% { transform: translateY(-30vh) translateX(-50%) rotate(-1deg); opacity: 0; }
      10% { opacity: 1; }
      100% { transform: translateY(150vh) translateX(-50%) rotate(1deg); opacity: 1; }
    }
    @keyframes rise {
      0% { transform: translateY(130vh) translateX(-50%) rotate(1deg); opacity: 0; }
      10% { opacity: 1; }
      100% { transform: translateY(-50vh) translateX(-50%) rotate(-1deg); opacity: 1; }
    }
    @keyframes fall-random {
      0% { transform: translateY(-30vh) translateX(-50%) rotate(-2deg); opacity: 0; }
      10% { opacity: 1; }
      100% { transform: translateY(150vh) translateX(-50%) rotate(2deg); opacity: 1; }
    }
    @keyframes zoom-pop {
      0% { transform: translate(-50%, -50%) scale(0) rotate(-5deg); opacity: 0; }
      15% { opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(10) rotate(5deg); opacity: 0; }
    }

    .animate-fall { animation-name: fall; animation-timing-function: linear; }
    .animate-rise { animation-name: rise; animation-timing-function: linear; }
    .animate-fall-random { animation-name: fall-random; animation-timing-function: linear; }
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
