// src/utils/colorScale.ts
export const getColorScale = (value: number, min: number, max: number): string => {
    const ratio = (value - min) / (max - min);
    const r = Math.floor(255 * (1 - ratio));
    const g = Math.floor(255 * ratio);
    return `rgb(${r},${g},0)`;
  };