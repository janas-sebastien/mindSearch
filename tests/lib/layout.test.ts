import { describe, it, expect } from "vitest";
import { calculateChildPositions } from "@/lib/layout";

describe("calculateChildPositions", () => {
  const HORIZONTAL_SPACING = 280;
  const VERTICAL_SPACING = 120;

  it("calculates position for single child with no existing children", () => {
    const parentPos = { x: 0, y: 0 };
    const positions = calculateChildPositions(parentPos, 1, 0);

    expect(positions).toHaveLength(1);
    expect(positions[0].x).toBe(HORIZONTAL_SPACING);
    expect(positions[0].y).toBe(0);
  });

  it("calculates positions for multiple children symmetrically", () => {
    const parentPos = { x: 100, y: 200 };
    const positions = calculateChildPositions(parentPos, 3, 0);

    expect(positions).toHaveLength(3);
    expect(positions[0].x).toBe(100 + HORIZONTAL_SPACING);
    expect(positions[1].x).toBe(100 + HORIZONTAL_SPACING);
    expect(positions[2].x).toBe(100 + HORIZONTAL_SPACING);

    // Middle child should be at parent's y level
    expect(positions[1].y).toBe(200);
    // First child above, third below
    expect(positions[0].y).toBe(200 - VERTICAL_SPACING);
    expect(positions[2].y).toBe(200 + VERTICAL_SPACING);
  });

  it("accounts for existing children when adding new ones", () => {
    const parentPos = { x: 0, y: 0 };
    const positions = calculateChildPositions(parentPos, 2, 1);

    expect(positions).toHaveLength(2);
    // With 1 existing child and 2 new ones (total 3), indices 1 and 2 are new
    const totalChildren = 3;
    const startOffset = -((totalChildren - 1) * VERTICAL_SPACING) / 2;

    expect(positions[0].y).toBe(startOffset + 1 * VERTICAL_SPACING);
    expect(positions[1].y).toBe(startOffset + 2 * VERTICAL_SPACING);
  });

  it("handles even number of children", () => {
    const parentPos = { x: 0, y: 0 };
    const positions = calculateChildPositions(parentPos, 2, 0);

    expect(positions).toHaveLength(2);
    // Two children should be centered around parent
    expect(positions[0].y).toBe(-VERTICAL_SPACING / 2);
    expect(positions[1].y).toBe(VERTICAL_SPACING / 2);
  });

  it("returns empty array for zero count", () => {
    const parentPos = { x: 0, y: 0 };
    const positions = calculateChildPositions(parentPos, 0, 0);

    expect(positions).toHaveLength(0);
  });

  it("preserves parent x offset", () => {
    const parentPos = { x: 500, y: 300 };
    const positions = calculateChildPositions(parentPos, 2, 0);

    positions.forEach((pos) => {
      expect(pos.x).toBe(500 + HORIZONTAL_SPACING);
    });
  });
});
