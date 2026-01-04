#!/usr/bin/env npx tsx
/**
 * CLI for generating 3D QR code models
 * 
 * Usage:
 *   npx tsx cli.ts output.glb
 *   npx tsx cli.ts output.3mf
 *   npx tsx cli.ts output.glb --text "https://example.com"
 */
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { parseArgs } from 'util';

// Polyfill fetch for local file loading in Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.toString();
  
  // Handle relative paths (./images/...)
  if (url.startsWith('./') || url.startsWith('../')) {
    const filePath = join(__dirname, url);
    try {
      const content = await readFile(filePath, 'utf-8');
      return new Response(content, {
        status: 200,
        headers: { 'Content-Type': 'image/svg+xml' }
      });
    } catch (err) {
      return new Response(null, { status: 404, statusText: 'Not Found' });
    }
  }
  
  // Fall back to original fetch for other URLs
  return originalFetch(input, init);
};

// Parse command line arguments
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    text: { type: 'string', short: 't', default: 'cookiecad.com' },
    size: { type: 'string', short: 's', default: '25' },
    depth: { type: 'string', short: 'd', default: '0.5' },
    'dot-shape': { type: 'string', default: 'square' },
    'inner-eye': { type: 'string', default: 'square' },
    'outer-eye': { type: 'string', default: 'outerEyeSquare' },
    'error-level': { type: 'string', short: 'e', default: 'M' },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (values.help || positionals.length === 0) {
  console.log(`
QR Code Generator CLI

Usage:
  npx tsx cli.ts <output.[glb|3mf]> [options]

Options:
  -t, --text <string>       Text to encode (default: "cookiecad.com")
  -s, --size <number>       Size in mm (default: 25)
  -d, --depth <number>      Extrusion depth in mm (default: 0.5)
  --dot-shape <string>      Dot shape (default: "square")
  --inner-eye <string>      Inner eye shape (default: "square")
  --outer-eye <string>      Outer eye shape (default: "outerEyeSquare")
  -e, --error-level <L|M|Q|H>  Error correction level (default: "M")
  -h, --help                Show this help

Examples:
  npx tsx cli.ts qr-code.glb
  npx tsx cli.ts qr-code.3mf --text "https://example.com" --size 30
  npx tsx cli.ts output.glb -t "Hello World" -s 50 -d 1
`);
  process.exit(0);
}

const outputFile = positionals[0];
const ext = extname(outputFile).toLowerCase();

if (ext !== '.glb' && ext !== '.3mf') {
  console.error(`Error: Output file must have .glb or .3mf extension, got: ${ext}`);
  process.exit(1);
}

async function main() {
  console.log('Initializing manifold...');
  
  // Initialize manifold-3d
  const manifold = await import('@cadit-app/manifold-3d');
  await manifold.default();
  
  // Import scene builder and export functions
  const { manifoldToGLTFDoc } = await import('@cadit-app/manifold-3d/lib/scene-builder.js');
  const exportModel = await import('@cadit-app/manifold-3d/lib/export-model.js');
  
  console.log('Loading QR code module...');
  
  // Import the QR code generator
  const qrCodeModule = await import('./src/main.ts');
  
  // Parse numeric values
  const size = parseFloat(values.size || '25');
  const extrudeDepth = parseFloat(values.depth || '0.5');
  
  const params = {
    text: values.text || 'cookiecad.com',
    size,
    extrudeDepth,
    dotShape: values['dot-shape'] || 'square',
    innerEyeShape: values['inner-eye'] || 'square',
    outerEyeShape: values['outer-eye'] || 'outerEyeSquare',
    errorCorrectionLevel: values['error-level'] || 'M',
  };
  
  console.log('Generating QR code with params:', params);
  
  // Generate the manifold
  const result = await qrCodeModule.default(params);
  
  if (!result || typeof result.getMesh !== 'function') {
    console.error('Error: Script did not return a valid Manifold object');
    process.exit(1);
  }
  
  console.log('Converting to GLTF document...');
  
  // Convert to GLTF document
  const doc = await manifoldToGLTFDoc(result);
  
  console.log(`Exporting to ${outputFile}...`);
  
  // Export to file
  await exportModel.writeFile(outputFile, doc);
  
  console.log(`✓ Generated ${outputFile}`);
}

main().catch((err) => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
