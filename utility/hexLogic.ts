

export function weightedAverageHexColors(hexArray:string[]):string{
  if (hexArray.length === 0) return '#000000';

  let totalWeight = 0;
  let rSum = 0, gSum = 0, bSum = 0;

  const n = hexArray.length;

  hexArray.forEach((hex, index) => {
    const weight = (index + 1); // recent frames get higher weight
    totalWeight += weight;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    rSum += r * weight;
    gSum += g * weight;
    bSum += b * weight;
  });

  const avgR = Math.round(rSum / totalWeight);
  const avgG = Math.round(gSum / totalWeight);
  const avgB = Math.round(bSum / totalWeight);

  return `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
};









export function getHexDistance(hex1: string, hex2: string): number {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  return Math.sqrt((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2);
  //  Euclidean distance
  //we have taken threshold of 40//
}







  // Convert hex to RGB
  export const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };