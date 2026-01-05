/**
 * @cadit-app/qr-code
 * 
 * A customizable QR Code generator for CADit.
 * Uses the defineParams API from @cadit-app/script-params.
 */

import { defineParams } from '@cadit-app/script-params';
import type { Manifold } from '@cadit-app/manifold-3d/manifoldCAD';
import { scaleToSizeAndCenter } from './crossSectionUtils';
import { svgExporter } from './svgExport';
import { pngExporter } from './pngExport';
import { qrCodeParamsSchema } from './params';
import { makeCrossSection } from './makeCrossSection';

// Re-export for external use
export { makeCrossSection } from './makeCrossSection';

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
