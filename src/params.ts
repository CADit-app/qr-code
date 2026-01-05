/**
 * Parameter definitions for the QR Code script.
 * 
 * Separated into its own file to allow type-safe imports in exporters
 * without circular dependencies.
 */

// SVG image paths (relative to this script)
export const dotShapeOptions = [
  { value: 'square', image: './images/squarePattern.svg' },
  { value: 'squarePadding', image: './images/squarePaddingPattern.svg' },
  { value: 'squareRounded', image: './images/squareRoundedPattern.svg' },
  { value: 'squareRoundedPadding', image: './images/squareRoundedPaddingPattern.svg' },
  { value: 'circle', image: './images/circlePattern.svg' },
  { value: 'circlePadding', image: './images/circlePaddingPattern.svg' },
  { value: 'star', image: './images/starPattern.svg' },
  { value: 'octagon', image: './images/octagonPattern.svg' },
  { value: 'plus', image: './images/plusPattern.svg' },
  { value: 'lines', image: './images/linePattern.svg' },
  { value: 'linesFilled', image: './images/linePatternFilled.svg' },
  { value: 'xShape', image: './images/xShapePattern.svg' },
  { value: 'xShapeInter', image: './images/xShapeInterPattern.svg' },
  { value: 'dotsInterVert', image: './images/dotsInterVertPattern.svg' },
  { value: 'dotsInterHor', image: './images/dotsInterHorPattern.svg' },
  { value: 'dotsInterFill', image: './images/dotsInterFillPattern.svg' },
  { value: 'dotsInterThinHor', image: './images/dotsInterThinHorPattern.svg' },
  { value: 'dotsInterThinVert', image: './images/dotsInterThinVertPattern.svg' },
  { value: 'dotsInterThinHorVert', image: './images/dotsInterThinHorVertPattern.svg' },
  { value: 'dotsInterThinEnds', image: './images/dotsInterThinEndsPattern.svg' },
  { value: 'heart', image: './images/heartPattern.svg' },
  { value: 'diamond', image: './images/diamondPattern.svg' },
  { value: 'squareHollow', image: './images/squareHollowPattern.svg' },
  { value: 'squareHollow2', image: './images/squareHollow2Pattern.svg' },
] as const;

export const innerEyeShapeOptions = [
  { value: 'square', image: './images/square.svg' },
  { value: 'squareRounded', image: './images/squareRounded.svg' },
  { value: 'circle', image: './images/circle.svg' },
  { value: 'octagon', image: './images/octagon.svg' },
  { value: 'plus', image: './images/plus.svg' },
  { value: 'diamond', image: './images/diamond.svg' },
  { value: 'squareHollow', image: './images/squareHollow.svg' },
  { value: 'heart', image: './images/heart.svg' },
] as const;

export const outerEyeShapeOptions = [
  { value: 'outerEyeSquare', image: './images/outerEyeSquare.svg' },
  { value: 'outerEyeSquareRounded', image: './images/outerEyeSquareRounded.svg' },
  { value: 'outerEyeCircle', image: './images/outerEyeCircle.svg' },
  { value: 'outerEyeInnerSquareRounded', image: './images/outerEyeInnerSquareRounded.svg' },
  { value: 'outerEyeSquareSingleSharpCorner', image: './images/outerEyeSquareSingleSharpCorner.svg' },
  { value: 'outerEyeOctagon', image: './images/outerEyeOctagon.svg' },
  { value: 'outerEyeSquareGrid', image: './images/outerEyeSquareGrid.svg' },
  { value: 'outerEyeCircleGrid', image: './images/outerEyeCircleGrid.svg' },
] as const;

/**
 * The parameter schema for the QR Code script.
 * Used by defineParams in main.ts and for type inference in exporters.
 */
export const qrCodeParamsSchema = {
  text: {
    type: 'text',
    label: 'Text to encode',
    default: 'cookiecad.com',
  },
  size: {
    type: 'number',
    label: 'Size (mm)',
    default: 25,
    min: 5,
    max: 200,
  },
  extrudeDepth: {
    type: 'number',
    label: 'Extrude Depth (mm)',
    default: 0.5,
    min: 0.1,
    max: 10,
    step: 0.1,
  },
  dotShape: {
    type: 'buttonGrid',
    label: 'Dot Shape',
    default: 'square',
    options: dotShapeOptions,
  },
  innerEyeShape: {
    type: 'buttonGrid',
    label: 'Inner Eye Shape',
    default: 'square',
    options: innerEyeShapeOptions,
  },
  outerEyeShape: {
    type: 'buttonGrid',
    label: 'Outer Eye Shape',
    default: 'outerEyeSquare',
    options: outerEyeShapeOptions,
  },
  errorCorrectionLevel: {
    type: 'choice',
    label: 'Error Correction Level',
    default: 'M',
    options: [
      { value: 'L', label: 'Low (7%)' },
      { value: 'M', label: 'Medium (15%)' },
      { value: 'Q', label: 'Quartile (25%)' },
      { value: 'H', label: 'High (30%)' },
    ],
  },
} as const;

/**
 * Type alias for the QR Code parameters.
 * Inferred from the schema using Params<typeof qrCodeParamsSchema>.
 */
import type { Params } from '@cadit-app/script-params';
export type QrCodeParams = Params<typeof qrCodeParamsSchema>;
