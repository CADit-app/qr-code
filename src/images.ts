/**
 * SVG image content for QR code shapes
 * 
 * In a CADit script, SVGs are loaded at runtime from relative paths.
 * This module provides functions to fetch and cache SVG content.
 */

// Cache for loaded SVG content
const svgCache: Record<string, string> = {};

/**
 * Mapping of shape names to their SVG file paths (relative to script)
 */
export const svgPaths: Record<string, { shape: string; pattern?: string }> = {
  // Basic shapes
  heart: { shape: './images/heart.svg', pattern: './images/heartPattern.svg' },
  circle: { shape: './images/circle.svg', pattern: './images/circlePattern.svg' },
  circlePadding: { shape: './images/circle.svg', pattern: './images/circlePaddingPattern.svg' },
  square: { shape: './images/square.svg', pattern: './images/squarePattern.svg' },
  squarePadding: { shape: './images/square.svg', pattern: './images/squarePaddingPattern.svg' },
  squareRounded: { shape: './images/squareRounded.svg', pattern: './images/squareRoundedPattern.svg' },
  squareRoundedPadding: { shape: './images/squareRounded.svg', pattern: './images/squareRoundedPaddingPattern.svg' },
  star: { shape: './images/star.svg', pattern: './images/starPattern.svg' },
  octagon: { shape: './images/octagon.svg', pattern: './images/octagonPattern.svg' },
  plus: { shape: './images/plus.svg', pattern: './images/plusPattern.svg' },
  diamond: { shape: './images/diamond.svg', pattern: './images/diamondPattern.svg' },
  squareHollow: { shape: './images/squareHollow.svg', pattern: './images/squareHollowPattern.svg' },
  squareHollow2: { shape: './images/squareHollow2.svg', pattern: './images/squareHollow2Pattern.svg' },
  xShape: { shape: './images/xShape.svg', pattern: './images/xShapePattern.svg' },
  
  // Line patterns
  line: { shape: './images/line.svg' },
  thinLine: { shape: './images/thinLine.svg' },
  wideLine: { shape: './images/wideLine.svg' },
  lines: { shape: './images/square.svg', pattern: './images/linePattern.svg' },
  linesFilled: { shape: './images/square.svg', pattern: './images/linePatternFilled.svg' },
  
  // Intermediate patterns
  xShapeInter: { shape: './images/xShape.svg', pattern: './images/xShapeInterPattern.svg' },
  dotsInterVert: { shape: './images/circle.svg', pattern: './images/dotsInterVertPattern.svg' },
  dotsInterHor: { shape: './images/circle.svg', pattern: './images/dotsInterHorPattern.svg' },
  dotsInterFill: { shape: './images/circle.svg', pattern: './images/dotsInterFillPattern.svg' },
  dotsInterThinHor: { shape: './images/circle.svg', pattern: './images/dotsInterThinHorPattern.svg' },
  dotsInterThinVert: { shape: './images/circle.svg', pattern: './images/dotsInterThinVertPattern.svg' },
  dotsInterThinHorVert: { shape: './images/circle.svg', pattern: './images/dotsInterThinHorVertPattern.svg' },
  dotsInterThinEnds: { shape: './images/circle.svg', pattern: './images/dotsInterThinEndsPattern.svg' },
  
  // Outer eye shapes
  outerEyeSquare: { shape: './images/outerEyeSquare.svg' },
  outerEyeSquareRounded: { shape: './images/outerEyeSquareRounded.svg' },
  outerEyeCircle: { shape: './images/outerEyeCircle.svg' },
  outerEyeInnerSquareRounded: { shape: './images/outerEyeInnerSquareRounded.svg' },
  outerEyeSquareSingleSharpCorner: { shape: './images/outerEyeSquareSingleSharpCorner.svg' },
  outerEyeOctagon: { shape: './images/outerEyeOctagon.svg' },
  outerEyeSquareGrid: { shape: './images/outerEyeSquareGrid.svg' },
  outerEyeCircleGrid: { shape: './images/outerEyeCircleGrid.svg' },
};

/**
 * SVG raw content - loaded at runtime
 * This will be populated when loadSvgContent is called
 */
export const svgRawContent: Record<string, string> = {};

/**
 * Load SVG content for a shape from its file
 * Uses the CADit script loader's fetch capability
 */
export async function loadSvgContent(shapeName: string): Promise<string> {
  if (svgCache[shapeName]) {
    return svgCache[shapeName];
  }
  
  const pathInfo = svgPaths[shapeName];
  if (!pathInfo) {
    throw new Error(`Unknown shape: ${shapeName}`);
  }
  
  // Fetch the SVG file - CADit runtime provides fetch for relative paths
  const response = await fetch(pathInfo.shape);
  if (!response.ok) {
    throw new Error(`Failed to load SVG: ${pathInfo.shape}`);
  }
  
  const content = await response.text();
  svgCache[shapeName] = content;
  svgRawContent[shapeName] = content;
  
  return content;
}

/**
 * Preload all SVG content
 * This should be called during initialization
 */
export async function preloadAllSvgs(): Promise<void> {
  const shapes = Object.keys(svgPaths);
  await Promise.all(shapes.map(loadSvgContent));
}
