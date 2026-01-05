/**
 * @cadit-app/qr-code
 * 
 * A customizable QR Code generator for CADit.
 * Uses the defineParams API from @cadit-app/script-params.
 */

import { defineParams } from '@cadit-app/script-params';
import type { CrossSection, Manifold } from '@cadit-app/manifold-3d/manifoldCAD';
import { parseSvgToCrossSection } from './utils';
import { generateQrCrossSection, CodeShapeOptions } from './generateQrCs';
import { getCodeShapeOptions, initializeDotShapeOptions } from './getCodeShapeOptions';
import { scaleToSizeAndCenter } from './crossSectionUtils';
import { svgExporter } from './svgExport';
import { pngExporter } from './pngExport';
import { qrCodeParamsSchema, type QrCodeParams } from './params';

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

/**
 * Main entry point using defineParams
 */
export default defineParams({
  params: qrCodeParamsSchema,
  exporters: {
    svg: svgExporter,
    png: pngExporter,
  },
  main: async (params): Promise<Manifold> => {
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
  },
});
