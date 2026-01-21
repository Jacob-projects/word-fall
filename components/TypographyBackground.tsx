
import React, { memo } from 'react';
import { FloatingWord } from '../types';
import AnimatedWord from './AnimatedWord';

interface Props {
  words: FloatingWord[];
}

const TypographyBackground: React.FC<Props> = ({ words }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {words.map((word) => (
        <AnimatedWord key={word.id} word={word} />
      ))}
    </div>
  );
};

export default memo(TypographyBackground);
