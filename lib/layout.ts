interface Position {
  x: number;
  y: number;
}

const HORIZONTAL_SPACING = 280;
const VERTICAL_SPACING = 120;

export function calculateChildPositions(
  parentPos: Position,
  count: number,
  existingChildren: number
): Position[] {
  const positions: Position[] = [];
  const totalChildren = existingChildren + count;
  const startOffset = -(totalChildren - 1) * VERTICAL_SPACING / 2;

  for (let i = 0; i < count; i++) {
    const index = existingChildren + i;
    positions.push({
      x: parentPos.x + HORIZONTAL_SPACING,
      y: parentPos.y + startOffset + index * VERTICAL_SPACING,
    });
  }

  return positions;
}
