/**
 * PNG Exporter for QR Code
 * 
 * Exports the QR code as a PNG file using resvg-wasm.
 * 
 * Note: When running as a dynamically loaded script in CADit, the WASM module
 * is loaded from esm.sh CDN since Vite's ?url import syntax isn't available.
 * 
 * The init() function is called by the CADit runtime before the first export,
 * allowing for WASM initialization to be separated from the export logic.
 */

import type { Exporter, ExportResult } from '@cadit-app/script-params';
import { svgExport } from './svgExport';
import * as resvg from '@resvg/resvg-wasm';
import type { QrCodeParams } from './params';

// Hardcoded version for WASM URL - update when upgrading @resvg/resvg-wasm dependency
const RESVG_VERSION = '2.6.2';

let wasmInitialized = false;
let wasmInitPromise: Promise<void> | null = null;

/**
 * Initialize resvg WASM module.
 * Fetches the WASM binary from esm.sh CDN to work in dynamically loaded scripts.
 * This is called automatically by CADit before the first export.
 * 
 * Safe to call multiple times - subsequent calls return immediately.
 * If initialization fails, subsequent calls will retry.
 */
async function initializeResvgWasm(): Promise<void> {
  if (wasmInitialized) return;
  if (wasmInitPromise) return wasmInitPromise;
  
  wasmInitPromise = (async () => {
    try {
      // Fetch WASM from esm.sh CDN using the version from package.json
      const wasmUrl = `https://esm.sh/@resvg/resvg-wasm@${RESVG_VERSION}/index_bg.wasm`;
      await resvg.initWasm(fetch(wasmUrl));
      wasmInitialized = true;
    } catch (error) {
      // Reset promise so retry is possible
      wasmInitPromise = null;
      throw error;
    }
  })();
  
  return wasmInitPromise;
}

/**
 * Generate PNG content from QR code parameters.
 * Uses a higher scale factor for better resolution.
 * 
 * Note: init() must be called before this function to ensure WASM is loaded.
 * When used via CADit's exporter system, this is handled automatically.
 */
export const pngExport = async (params: QrCodeParams): Promise<ExportResult> => {
  // Generate the SVG using the existing exporter with 10x scale for good resolution
  const scale = 10;
  const svgResult = await svgExport(params, scale);
  const svgContent = svgResult.data as string;

  // Ensure WASM is initialized (safe to call multiple times, noop if already done)
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
 * 
 * The init() function handles WASM initialization before the first export.
 * This allows the heavy WASM loading to happen once, explicitly, rather than
 * being hidden inside the export function.
 */
export const pngExporter: Exporter<QrCodeParams> = {
  name: "PNG",
  label: "Download PNG",
  description: "Export the QR code as a PNG image file.",
  init: initializeResvgWasm,
  export: pngExport,
};
