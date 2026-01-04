/**
 * Cross-section utility functions for scaling and centering
 */

import type { CrossSection, Vec2 } from '@cadit-app/manifold-3d/manifoldCAD';

/**
 * Center the cross section by translating it to the origin.
 */
export const centerCrossSection = (crossSection: CrossSection): CrossSection => {
  const bounds = crossSection.bounds();
  const centerX = (bounds.max[0] + bounds.min[0]) / 2;
  const centerY = (bounds.max[1] + bounds.min[1]) / 2;

  return crossSection.translate([-centerX, -centerY]);
};

/**
 * Scale a cross section to fit within the specified dimensions
 */
export const scaleToSize = (
  crossSection: CrossSection, 
  width: number, 
  height: number, 
  keepAspectRatio = true
): CrossSection => {
  const bounds = crossSection.bounds();
  const scaleX = width / (bounds.max[0] - bounds.min[0]);
  const scaleY = height / (bounds.max[1] - bounds.min[1]);
  const aspectScale = Math.min(scaleX, scaleY);
  const scale = keepAspectRatio ? aspectScale : [scaleX, scaleY] as Vec2;

  return crossSection.scale(scale);
};

/**
 * Scale a cross section to fit within the specified dimensions and center it
 */
export const scaleToSizeAndCenter = (
  crossSection: CrossSection, 
  width: number, 
  height: number, 
  keepAspectRatio = true
): CrossSection => {
  const scaled = scaleToSize(crossSection, width, height, keepAspectRatio);
  return centerCrossSection(scaled);
};
