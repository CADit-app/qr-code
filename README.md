# @cadit-app/qr-code

Generate customizable 3D QR codes with various dot shapes, eye styles, and error correction levels.

![QR Code Generator Preview](images/preview.png)

## Features

- **Multiple Dot Shapes**: Square, circle, star, heart, diamond, and many more
- **Custom Eye Styles**: Choose from various inner and outer eye shapes
- **Error Correction Levels**: L (7%), M (15%), Q (25%), H (30%)
- **Adjustable Size**: Set the output size in millimeters
- **Variable Extrusion Depth**: Control how thick the QR code is
- **Multiple Output Formats**: GLB, 3MF (3D models), SVG, PNG (2D graphics)
- **CLI Support**: Generate outputs directly from the command line

## Usage

### Open in CADit

Open this design in [CADit](https://app.cadit.app) to customize and generate your 3D QR code with a visual interface. You can also download SVG and PNG exports directly from the parameter menu.

### Command Line

You can generate QR codes directly from the command line:

```bash
# Install dependencies
pnpm install

# Generate a .glb file (3D model)
pnpm build:glb

# Generate a .3mf file (for 3D printing)
pnpm build:3mf

# Generate a .svg file (vector graphic)
pnpm build:svg

# Generate a .png file (raster image)
pnpm build:png

# Generate with custom parameters
npx tsx cli.ts my-qr.glb --text "https://example.com" --size 40 --depth 1
npx tsx cli.ts my-qr.svg --text "https://example.com" --dot-shape circle
npx tsx cli.ts my-qr.png --text "Hello World" --inner-eye circle
```

### CLI Options

```
Usage:
  npx tsx cli.ts <output.[glb|3mf|svg|png]> [options]

Output Formats:
  .glb   3D model (GLTF binary)
  .3mf   3D model for printing
  .svg   2D vector graphic
  .png   2D raster image

Options:
  -t, --text <string>          Text to encode (default: "cookiecad.com")
  -s, --size <number>          Size in mm (default: 25)
  -d, --depth <number>         Extrusion depth in mm (default: 0.5, 3D only)
  --dot-shape <string>         Dot shape (default: "square")
  --inner-eye <string>         Inner eye shape (default: "square")
  --outer-eye <string>         Outer eye shape (default: "outerEyeSquare")
  -e, --error-level <L|M|Q|H>  Error correction level (default: "M")
  -h, --help                   Show help

Examples:
  npx tsx cli.ts qr-code.glb
  npx tsx cli.ts qr-code.svg --text "https://example.com"
  npx tsx cli.ts qr-code.png --dot-shape circle
  npx tsx cli.ts qr-code.3mf --text "Hello World" --size 50 --depth 1
```

### Available Shapes

**Dot Shapes**: `square`, `squarePadding`, `squareRounded`, `squareRoundedPadding`, `circle`, `circlePadding`, `star`, `octagon`, `plus`, `lines`, `linesFilled`, `xShape`, `xShapeInter`, `dotsInterVert`, `dotsInterHor`, and more.

**Inner Eye Shapes**: `square`, `squareRounded`, `circle`, `star`, `octagon`, `plus`, `diamond`

**Outer Eye Shapes**: `outerEyeSquare`, `outerEyeSquareRounded`, `outerEyeCircle`, `outerEyeOctagon`, `outerEyeSquareGrid`, `outerEyeCircleGrid`

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| text | text | "cookiecad.com" | Text to encode in the QR code |
| size | number | 25 | Size in millimeters |
| extrudeDepth | number | 0.5 | Extrusion depth in millimeters |
| dotShape | buttonGrid | square | Shape of the QR code dots |
| innerEyeShape | buttonGrid | square | Shape of the inner eye elements |
| outerEyeShape | buttonGrid | outerEyeSquare | Shape of the outer eye frames |
| errorCorrectionLevel | choice | M | Error correction level |

## License

MIT

---

<p align="center">
  <sub>Created with <a href="https://cadit.app">CADit</a> - The open platform for code-based 3D models.</sub>
</p>
