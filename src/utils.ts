/**
 * Utility functions for parsing SVG files into Manifold CrossSections
 */

import { CrossSection } from '@cadit-app/manifold-3d/manifoldCAD';
import { svgToPolygons } from '@cadit-app/svg-sampler';
import { loadSvgContent } from './images';

/**
 * Parse an SVG shape into a Manifold CrossSection
 */
export const parseSvgToCrossSection = async (
  shapeName: string,
  maxError: number = 0.1
): Promise<CrossSection> => {
  // Load SVG content using the mapping (handles value-to-filename translation)
  const svgContent = await loadSvgContent(shapeName);
  if (!svgContent) {
    throw new Error(`Unknown shape: ${shapeName}`);
  }

  // Sample the SVG into polygons
  const polygons = await svgToPolygons(svgContent, { maxError });

  // Flip the Y-axis for SVG paths (SVG uses Y-down, but 3D modeling uses Y-up)
  const flippedPolygons = polygons.map((polygon: { points: [number, number][] }) => {
    return polygon.points.map(([x, y]) => [x, -y]) as [number, number][];
  });

  // Create and return a cross-section from the sampled paths
  return new CrossSection(flippedPolygons, "EvenOdd");
};
