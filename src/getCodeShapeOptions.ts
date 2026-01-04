/**
 * Code shape options configuration
 * Maps shape names to their specific rendering options
 */

import { CodeShapeOptions } from './generateQrCs';
import { parseSvgToCrossSection } from './utils';
import { scaleToSizeAndCenter } from './crossSectionUtils';

let dotShapeOptionsMap: Record<string, Partial<CodeShapeOptions>> = {};

/**
 * Initialize the dot shape options map with required cross-sections
 * Must be called before generating QR codes
 */
export const initializeDotShapeOptions = async (): Promise<void> => {
  const line = scaleToSizeAndCenter(await parseSvgToCrossSection('line'), 3, 3);
  const thinLine = scaleToSizeAndCenter(await parseSvgToCrossSection('thinLine'), 3, 1, false);
  const wideLine = scaleToSizeAndCenter(await parseSvgToCrossSection('wideLine'), 2, 1.8, false);

  dotShapeOptionsMap = {
    square: {},
    squarePadding: {
      padding: 0.1,
    },
    squareRounded: {},
    squareRoundedPadding: {
      padding: 0.1,
    },
    heart: {},
    circle: {},
    circlePadding: {
      padding: 0.1,
    },
    star: {
      padding: 0.1,
    },
    octagon: {},
    plus: {},
    lines: {
      padding: 0.33,
      intermediateShape: line,
      horizontalFill: true,
      verticalFill: true,
    },
    linesFilled: {
      padding: 0.33,
      intermediateShape: line,
      fill: true,
    },
    xShapeInter: {
      intermediateShape: thinLine,
      horizontalFill: true,
      verticalFill: true,
    },
    dotsInterVert: {
      padding: 0.1,
      intermediateShape: wideLine,
      verticalFill: true
    },
    dotsInterHor: {
      padding: 0.1,
      intermediateShape: wideLine,
      horizontalFill: true
    },
    dotsInterFill: {
      padding: 0.1,
      intermediateShape: wideLine,
      fill: true,
    },
    dotsInterThinHor: {
      padding: 0.2,
      intermediateShape: thinLine,
      horizontalFill: true
    },
    dotsInterThinVert: {
      padding: 0.2,
      intermediateShape: thinLine,
      verticalFill: true
    },
    dotsInterThinHorVert: {
      padding: 0.2,
      intermediateShape: thinLine,
      horizontalFill: true,
      verticalFill: true
    },
    dotsInterThinEnds: {
      padding: 0.2,
      intermediateShape: thinLine,
      horizontalFill: true,
      verticalFill: true,
      onlyPlaceDotOnEnds: true,
    },
    diamond: {},
    squareHollow: {},
    squareHollow2: {},
    xShape: {},
  };
};

/**
 * Get code shape options for a given shape name
 */
export const getCodeShapeOptions = (shape: any, shapeName: string): CodeShapeOptions => {
  const options = dotShapeOptionsMap[shapeName] || {};
  return {
    ...options,
    dotShape: shape,
  } as CodeShapeOptions;
};
