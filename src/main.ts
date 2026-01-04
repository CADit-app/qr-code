/**
 * @cadit-app/qr-code
 * 
 * A customizable QR Code generator for CADit.
 * Uses the new defineParams API from @cadit-app/script-params.
 */

import { defineParams } from '@cadit-app/script-params';
import type { CrossSection, Manifold } from '@cadit-app/manifold-3d/manifoldCAD';
import { parseSvgToCrossSection } from './utils';
import { generateQrCrossSection, CodeShapeOptions } from './generateQrCs';
import { getCodeShapeOptions, initializeDotShapeOptions } from './getCodeShapeOptions';
import { scaleToSizeAndCenter } from './crossSectionUtils';

// SVG image paths (relative to this script)
const dotShapeOptions = [
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

const innerEyeShapeOptions = [
  { value: 'square', image: './images/square.svg' },
  { value: 'squareRounded', image: './images/squareRounded.svg' },
  { value: 'circle', image: './images/circle.svg' },
  { value: 'octagon', image: './images/octagon.svg' },
  { value: 'plus', image: './images/plus.svg' },
  { value: 'diamond', image: './images/diamond.svg' },
  { value: 'squareHollow', image: './images/squareHollow.svg' },
  { value: 'heart', image: './images/heart.svg' },
] as const;

const outerEyeShapeOptions = [
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
 * Generate the QR code cross-section (2D shape)
 */
export const makeCrossSection = async (params: {
  text: string;
  dotShape: string;
  innerEyeShape: string;
  outerEyeShape: string;
  errorCorrectionLevel: string;
}): Promise<CrossSection> => {
  // Initialize dot shape options
  await initializeDotShapeOptions();

  // Parse the SVG files into cross-sections
  const dotShape = (await parseSvgToCrossSection(params.dotShape)).rotate(180);
  const innerEyeShape = (await parseSvgToCrossSection(params.innerEyeShape)).rotate(180);
  const outerEyeShape = (await parseSvgToCrossSection(params.outerEyeShape)).rotate(180);

  // Generate the QR code cross-section
  const codeShapeOptions = getCodeShapeOptions(dotShape, params.dotShape);
  codeShapeOptions.errorCorrectionLevel = params.errorCorrectionLevel as CodeShapeOptions['errorCorrectionLevel'];
  
  const qrCode = (await generateQrCrossSection({
    text: params.text,
    codeShapeOptions,
    eyeShapeOptions: {
      innerEyeShape,
      outerEyeShape
    }
  })).mirror([0, 1]);

  return qrCode;
};

/**
 * Main entry point using defineParams
 */
export default defineParams({
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
}, async (params): Promise<Manifold> => {
  // Generate the 2D cross-section
  const qrCode = await makeCrossSection({
    text: params.text,
    dotShape: params.dotShape,
    innerEyeShape: params.innerEyeShape,
    outerEyeShape: params.outerEyeShape,
    errorCorrectionLevel: params.errorCorrectionLevel,
  });

  // Scale and extrude the QR code
  const sized = scaleToSizeAndCenter(qrCode, params.size, params.size);
  return sized.extrude(params.extrudeDepth);
});
