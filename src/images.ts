/**
 * SVG image content for QR code shapes
 * 
 * SVGs are embedded directly as strings to avoid runtime fetch issues
 * in the CADit browser environment.
 */

import { getSvgContent, embeddedSvgs } from './embeddedSvgs';

/**
 * Mapping of shape names to their SVG file names (without extension)
 */
export const svgPaths: Record<string, { shape: string; pattern?: string }> = {
  // Basic shapes
  heart: { shape: 'heart', pattern: 'heartPattern' },
  circle: { shape: 'circle', pattern: 'circlePattern' },
  circlePadding: { shape: 'circle', pattern: 'circlePaddingPattern' },
  square: { shape: 'square', pattern: 'squarePattern' },
  squarePadding: { shape: 'square', pattern: 'squarePaddingPattern' },
  squareRounded: { shape: 'squareRounded', pattern: 'squareRoundedPattern' },
  squareRoundedPadding: { shape: 'squareRounded', pattern: 'squareRoundedPaddingPattern' },
  star: { shape: 'star', pattern: 'starPattern' },
  octagon: { shape: 'octagon', pattern: 'octagonPattern' },
  plus: { shape: 'plus', pattern: 'plusPattern' },
  diamond: { shape: 'diamond', pattern: 'diamondPattern' },
  squareHollow: { shape: 'squareHollow', pattern: 'squareHollowPattern' },
  squareHollow2: { shape: 'squareHollow2', pattern: 'squareHollow2Pattern' },
  xShape: { shape: 'xShape', pattern: 'xShapePattern' },
  
  // Line patterns
  line: { shape: 'line' },
  thinLine: { shape: 'thinLine' },
  wideLine: { shape: 'wideLine' },
  lines: { shape: 'square', pattern: 'linePattern' },
  linesFilled: { shape: 'square', pattern: 'linePatternFilled' },
  
  // Intermediate patterns
  xShapeInter: { shape: 'xShape', pattern: 'xShapeInterPattern' },
  dotsInterVert: { shape: 'circle', pattern: 'dotsInterVertPattern' },
  dotsInterHor: { shape: 'circle', pattern: 'dotsInterHorPattern' },
  dotsInterFill: { shape: 'circle', pattern: 'dotsInterFillPattern' },
  dotsInterThinHor: { shape: 'circle', pattern: 'dotsInterThinHorPattern' },
  dotsInterThinVert: { shape: 'circle', pattern: 'dotsInterThinVertPattern' },
  dotsInterThinHorVert: { shape: 'circle', pattern: 'dotsInterThinHorVertPattern' },
  dotsInterThinEnds: { shape: 'circle', pattern: 'dotsInterThinEndsPattern' },
  
  // Outer eye shapes
  outerEyeSquare: { shape: 'outerEyeSquare' },
  outerEyeSquareRounded: { shape: 'outerEyeSquareRounded' },
  outerEyeCircle: { shape: 'outerEyeCircle' },
  outerEyeInnerSquareRounded: { shape: 'outerEyeInnerSquareRounded' },
  outerEyeSquareSingleSharpCorner: { shape: 'outerEyeSquareSingleSharpCorner' },
  outerEyeOctagon: { shape: 'outerEyeOctagon' },
  outerEyeSquareGrid: { shape: 'outerEyeSquareGrid' },
  outerEyeCircleGrid: { shape: 'outerEyeCircleGrid' },
};

/**
 * SVG raw content - populated from embedded SVGs
 * This provides backward compatibility with code that expects svgRawContent
 */
export const svgRawContent: Record<string, string> = embeddedSvgs;

/**
 * Load SVG content for a shape
 * Now synchronous since SVGs are embedded - returns a resolved promise for backward compatibility
 */
export async function loadSvgContent(shapeName: string): Promise<string> {
  // For shape names that map to different SVG files, use the mapping
  const pathInfo = svgPaths[shapeName];
  if (pathInfo) {
    return getSvgContent(pathInfo.shape);
  }
  
  // Otherwise try to get the SVG directly by name
  return getSvgContent(shapeName);
}

/**
 * Preload all SVG content
 * No-op now since SVGs are embedded, kept for backward compatibility
 */
export async function preloadAllSvgs(): Promise<void> {
  // No-op - SVGs are embedded at build time
}
