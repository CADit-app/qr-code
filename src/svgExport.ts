/**
 * SVG Exporter for QR Code
 * 
 * Exports the QR code as an SVG file.
 */

import type { Exporter, ExportResult } from '@cadit-app/script-params';
import { makeCrossSection } from './main';
import type { QrCodeParams } from './params';

/**
 * Generate SVG content from QR code parameters.
 * @param params - The QR code parameters
 * @param scale - Optional scale factor for the SVG output (default: 1)
 */
export const svgExport = async (params: QrCodeParams, scale = 1): Promise<ExportResult> => {
  // Generate the cross-section shape
  const crossSection = await makeCrossSection({
    text: params.text,
    dotShape: params.dotShape,
    innerEyeShape: params.innerEyeShape,
    outerEyeShape: params.outerEyeShape,
    errorCorrectionLevel: params.errorCorrectionLevel,
  });
  
  const polygons = crossSection.toPolygons();

  // Find bounds for viewBox
  const bounds = crossSection.bounds();
  const minX = bounds.min[0];
  const minY = bounds.min[1];
  const maxX = bounds.max[0];
  const maxY = bounds.max[1];

  // Add a small margin
  const margin = 2;
  const svgMinX = minX - margin;
  const svgMinY = minY - margin;
  const svgMaxX = maxX + margin;
  const svgMaxY = maxY + margin;
  const width = svgMaxX - svgMinX;
  const height = svgMaxY - svgMinY;

  // Build a single path with all polygons as subpaths
  const pathData = polygons.map((polygon) => {
    if (!polygon.length) return '';
    // Transform and round coordinates for SVG size optimization
    const transform = (pt: [number, number]) => [
      +(pt[0] * scale).toFixed(2),
      +(-pt[1] * scale).toFixed(2)
    ];
    const [firstX, firstY] = transform(polygon[0]);
    const moveTo = `M ${firstX},${firstY}`;
    const lines = polygon.slice(1).map(pt => {
      const [lx, ly] = transform(pt);
      return `L ${lx},${ly}`;
    }).join(' ');
    return `${moveTo} ${lines} Z`;
  }).join(' ');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width * scale}" height="${height * scale}" viewBox="${svgMinX * scale} ${-svgMaxY * scale} ${width * scale} ${height * scale}">
<path d="${pathData}" fill="#000" fill-rule="evenodd"/>
</svg>`;

  return {
    mimeType: "image/svg+xml",
    fileName: "qr-code.svg",
    data: svgContent,
  };
};

/**
 * SVG Exporter definition for use with defineParams.
 */
export const svgExporter: Exporter<QrCodeParams> = {
  name: "SVG",
  label: "Download SVG",
  description: "Export the QR code as a scalable vector graphic (SVG) file.",
  export: svgExport,
};
