
export type WordBehavior = 'top-to-bottom' | 'bottom-to-top' | 'background-to-front' | 'random-fall';

export interface FloatingWord {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  behavior: WordBehavior;
  fontSize: string;
  fontFamily: string;
  textTransform: 'uppercase' | 'none';
  shadowEnabled: boolean; // Added
  shadowIntensity: number; // Added
  duration: number;
  delay: number;
  isGradient: boolean;
  gradientColors: string[];
}

export interface ShadowSettings {
  color: string;
  blur: number;
  enabled: boolean;
}
