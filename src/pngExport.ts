/**
 * PNG Exporter for QR Code
 * 
 * Exports the QR code as a PNG file using resvg-wasm.
 * 
 * Note: When running as a dynamically loaded script in CADit, the WASM module
 * is loaded from esm.sh CDN since Vite's ?url import syntax isn't available.
 */

import type { Exporter, ExportResult } from '@cadit-app/script-params';
import { svgExport } from './svgExport';
import * as resvg from '@resvg/resvg-wasm';
import type { QrCodeParams } from './params';

let wasmInitialized = false;
let wasmInitPromise: Promise<void> | null = null;

/**
 * Initialize resvg WASM module.
 * Fetches the WASM binary from esm.sh CDN to work in dynamically loaded scripts.
 */
async function initializeResvgWasm() {
  if (wasmInitialized) return;
  if (wasmInitPromise) return wasmInitPromise;
  
  wasmInitPromise = (async () => {
    try {
      // Fetch WASM from esm.sh CDN - works in any JavaScript environment
      const wasmUrl = 'https://esm.sh/@resvg/resvg-wasm@2.6.2/index_bg.wasm';
      await resvg.initWasm(fetch(wasmUrl));
      wasmInitialized = true;
    } catch (error) {
      wasmInitPromise = null;
      throw error;
    }
  })();
  
  return wasmInitPromise;
}

/**
 * Generate PNG content from QR code parameters.
 * Uses a higher scale factor for better resolution.
 */
export const pngExport = async (params: QrCodeParams): Promise<ExportResult> => {
  // Generate the SVG using the existing exporter with 10x scale for good resolution
  const scale = 10;
  const svgResult = await svgExport(params, scale);
  const svgContent = svgResult.data as string;

  await initializeResvgWasm();

  // Render SVG to PNG buffer using resvg
  const resvgInstance = new resvg.Resvg(svgContent, {});
  const pngData = resvgInstance.render();
  const pngBuffer = pngData.asPng(); // Uint8Array

  // Convert Uint8Array to ArrayBuffer for ExportResult
  const arrayBuffer = pngBuffer.buffer.slice(
    pngBuffer.byteOffset,
    pngBuffer.byteOffset + pngBuffer.byteLength
  );

  return {
    mimeType: "image/png",
    fileName: "qr-code.png",
    data: arrayBuffer as ArrayBuffer,
  };
};

/**
 * PNG Exporter definition for use with defineParams.
 */
export const pngExporter: Exporter<QrCodeParams> = {
  name: "PNG",
  label: "Download PNG",
  description: "Export the QR code as a PNG image file.",
  export: pngExport,
};
