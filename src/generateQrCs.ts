/**
 * QR Code generation logic using Manifold CrossSections
 */

import QRCode from 'qrcode';
import { CrossSection } from '@cadit-app/manifold-3d/manifoldCAD';
import { scaleToSizeAndCenter } from './crossSectionUtils';

export type CodeShapeOptions = {
  dotShape?: any; // CrossSection - shape used for dots
  smallDotShape?: any; // CrossSection - shape for isolated dots
  intermediateShape?: any; // CrossSection - shape between dots
  horizontalFill?: boolean; // Fill horizontally with intermediate shape
  verticalFill?: boolean; // Fill vertically with intermediate shape
  fill?: boolean; // Fill both directions with intermediate shape
  errorCorrectionLevel?: 'H' | 'L' | 'M' | 'Q' | 'high' | 'low' | 'medium' | 'quartile';
  padding?: number; // Padding around dot shape (0-1)
  onlyPlaceDotOnEnds?: boolean; // Only place dots at endpoints
};

export type EyeShapeOptions = {
  innerEyeShape?: any; // CrossSection - shape for inner eye
  outerEyeShape?: any; // CrossSection - shape for outer eye frame
};

/**
 * Check if a position is reserved (part of finder patterns)
 */
const isReserved = (col: number, row: number, size: number): boolean => {
  return ((col < 7 || col > size - 8) && (row < 7 || row > size - 8)) && !(col > size - 8 && row > size - 8);
};

/**
 * Generate intermediate dots between QR code cells
 */
const generateIntermediateDots = (params: {
  data: Uint8Array<ArrayBufferLike>;
  size: number;
  row: number;
  col: number;
  options: CodeShapeOptions;
  dotSize: number;
}): any[] => {
  const tryVert = params.options.verticalFill || params.options.fill;
  const tryHor = params.options.horizontalFill || params.options.fill;

  if (!tryVert && !tryHor && !params.options.fill) {
    return [];
  }

  if (!params.options.intermediateShape) {
    return [];
  }

  const intermediateDots: any[] = [];

  if (tryVert) {
    const canAccessAbove = params.row < params.size - 1 && !isReserved(params.col, params.row + 1, params.size);
    if (canAccessAbove && params.data[(params.row + 1) * params.size + params.col]) {
      const x = params.col * params.dotSize;
      const y = params.row * params.dotSize + params.dotSize / 2;
      const newDot = params.options.intermediateShape.rotate(90).translate([x, y]);
      intermediateDots.push(newDot);
    }
  }
  
  if (tryHor) {
    const canAccessRight = params.col < params.size - 1 && !isReserved(params.col + 1, params.row, params.size);
    if (canAccessRight && params.data[params.row * params.size + params.col + 1]) {
      const x = params.col * params.dotSize + params.dotSize / 2;
      const y = params.row * params.dotSize;
      const newDot = params.options.intermediateShape.translate([x, y]);
      intermediateDots.push(newDot);
    }
  }

  return intermediateDots;
};

/**
 * Generate middle dot between 4 cells
 */
const generateMiddleDot = (params: {
  data: Uint8Array<ArrayBufferLike>;
  size: number;
  row: number;
  col: number;
  options: CodeShapeOptions;
  dotSize: number;
  scaledDot: any;
}): any[] => {
  const canAccessAbove = params.row < params.size - 1 && !isReserved(params.col, params.row + 1, params.size);
  const canAccessRight = params.col < params.size - 1 && !isReserved(params.col + 1, params.row, params.size);
  const canAccessTopRight = params.row < params.size - 1 && params.col < params.size - 1 && !isReserved(params.col + 1, params.row + 1, params.size);
  const canAccessCurrent = !isReserved(params.col, params.row, params.size);

  if (!canAccessAbove || !canAccessRight || !canAccessTopRight || !canAccessCurrent) {
    return [];
  }

  const currentDot = params.data[params.row * params.size + params.col];
  const aboveDot = params.data[(params.row + 1) * params.size + params.col];
  const rightDot = params.data[params.row * params.size + params.col + 1];
  const topRightDot = params.data[(params.row + 1) * params.size + params.col + 1];
  
  if (!currentDot || !aboveDot || !rightDot || !topRightDot) {
    return [];
  }

  const x = params.col * params.dotSize + params.dotSize / 2;
  const y = params.row * params.dotSize + params.dotSize / 2;
  const newDot = params.scaledDot.translate([x, y]);
  return [newDot];
};

/**
 * Count neighboring dots
 */
const countNeighbors = (data: Uint8Array<ArrayBufferLike>, size: number, row: number, col: number): number => {
  let neighborCount = 0;

  const isAccessible = (neighborRow: number, neighborCol: number): boolean => {
    if (neighborRow < 0 || neighborRow >= size || neighborCol < 0 || neighborCol >= size) {
      return false;
    }
    if (isReserved(neighborCol, neighborRow, size)) {
      return false;
    }
    return !!data[neighborRow * size + neighborCol];
  };

  if (isAccessible(row - 1, col)) neighborCount++;
  if (isAccessible(row + 1, col)) neighborCount++;
  if (isAccessible(row, col - 1)) neighborCount++;
  if (isAccessible(row, col + 1)) neighborCount++;

  return neighborCount;
};

/**
 * Generate a QR code CrossSection
 */
export const generateQrCrossSection = async ({
  text,
  codeShapeOptions,
  eyeShapeOptions,
  overrideData
}: {
  text: string;
  codeShapeOptions?: CodeShapeOptions;
  eyeShapeOptions?: EyeShapeOptions;
  overrideData?: {
    data: Uint8Array<ArrayBufferLike>;
    size: number;
  };
}): Promise<CrossSection> => {
  const qrCode = overrideData ? undefined : QRCode.create(text, { 
    errorCorrectionLevel: codeShapeOptions?.errorCorrectionLevel || 'H' 
  });

  const size = overrideData ? overrideData.size : qrCode!.modules.size;
  const data = overrideData ? overrideData.data : qrCode!.modules.data;

  const dotSize = 2;
  const eyeSize = 7 * dotSize;
  const innerEyeSize = 3 * dotSize;
  
  const rawDotShape = codeShapeOptions?.dotShape || CrossSection.square([dotSize, dotSize], true);
  const rawInnerEye = eyeShapeOptions?.innerEyeShape || CrossSection.square([innerEyeSize, innerEyeSize], true);
  const rawOuterEye = eyeShapeOptions?.outerEyeShape || 
    CrossSection.square([eyeSize, eyeSize], true).subtract(CrossSection.square([innerEyeSize + 2 * dotSize, innerEyeSize + 2 * dotSize], true));

  const maxError = 0.01;
  const paddingFactor = codeShapeOptions?.padding || 0;
  const dot = scaleToSizeAndCenter(rawDotShape, (1 - paddingFactor) * dotSize, (1 - paddingFactor) * dotSize).simplify(maxError);
  const innerEye = scaleToSizeAndCenter(rawInnerEye, innerEyeSize, innerEyeSize).simplify(maxError);
  const outerEye = scaleToSizeAndCenter(rawOuterEye, eyeSize, eyeSize).simplify(maxError);

  const dots: any[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (!data[i]) continue;
    
    const col = Math.floor(i % size);
    const row = Math.floor(i / size);
    const x = col * dotSize;
    const y = row * dotSize;
    
    const reserved = isReserved(col, row, size);
    if (reserved) continue;

    // Add intermediate dots
    const intermediateDots = generateIntermediateDots({
      data,
      size,
      row,
      col,
      options: codeShapeOptions || {},
      dotSize
    });
    
    if (intermediateDots.length > 0) {
      dots.push(...intermediateDots);
    }

    // Add middle dot
    if (codeShapeOptions?.fill) {
      const middleDots = generateMiddleDot({
        data,
        size,
        row,
        col,
        options: codeShapeOptions || {},
        dotSize,
        scaledDot: dot
      });
      if (middleDots.length > 0) {
        dots.push(...middleDots);
      }
    }

    // Add the main dot
    const newDot = dot.translate([x, y]);
    const neighborCount = countNeighbors(data, size, row, col);
    
    if (codeShapeOptions?.onlyPlaceDotOnEnds) {
      if (neighborCount < 2) {
        dots.push(newDot);
      }
    } else if (codeShapeOptions?.smallDotShape && neighborCount === 0) {
      const placedSmallDot = codeShapeOptions.smallDotShape.translate([x, y]);
      dots.push(placedSmallDot);
    } else {
      dots.push(newDot);
    }
  }

  // Add finder pattern eyes
  const eye = CrossSection.union(innerEye, outerEye);
  const topLeftEye = eye.translate([3 * dotSize, size * dotSize - 4 * dotSize]);
  const bottomLeftEye = eye.translate([3 * dotSize, 3 * dotSize]);
  const bottomRightEye = eye.translate([size * dotSize - 4 * dotSize, 3 * dotSize]);

  dots.push(topLeftEye, bottomLeftEye, bottomRightEye);

  return CrossSection.union(dots);
};
