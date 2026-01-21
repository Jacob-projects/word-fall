
export const NEON_COLORS = [
  '#FF00FF', // Bright Magenta
  '#00FFFF', // Bright Cyan
  '#FFFF00', // Bright Yellow
  '#00FF00', // Bright Lime
  '#FF3131', // Neon Red
  '#8A2BE2', // Blue Violet
  '#FF8C00', // Dark Orange
  '#FF1493', // Deep Pink
  '#39FF14', // Neon Green
  '#FFFFFF', // White
];

export const AVAILABLE_FONTS = [
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Bebas Neue', value: "'Bebas Neue', sans-serif" },
  { name: 'Inter Black', value: "'Inter', sans-serif" },
  { name: 'Playfair', value: "'Playfair Display', serif" },
  { name: 'JetBrains', value: "'JetBrains Mono', monospace" },
  { name: 'Dancing', value: "'Dancing Script', cursive" },
];

export const getRandomColor = () => {
  return NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
};

export const getRandomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
