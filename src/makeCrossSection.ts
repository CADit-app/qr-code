/**
 * Cross-section generation for QR Code
 * 
 * Extracted to its own module to avoid circular dependencies.
 */

import type { CrossSection } from '@cadit-app/manifold-3d/manifoldCAD';
import { parseSvgToCrossSection } from './utils';
import { generateQrCrossSection, CodeShapeOptions } from './generateQrCs';
import { getCodeShapeOptions, initializeDotShapeOptions } from './getCodeShapeOptions';
import type { QrCodeParams } from './params';

/**
 * Generate the QR code cross-section (2D shape)
 */
export const makeCrossSection = async (params: Pick<QrCodeParams, 'text' | 'dotShape' | 'innerEyeShape' | 'outerEyeShape' | 'errorCorrectionLevel'>): Promise<CrossSection> => {
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
