/**
 * Compute the roots of ax² + bx + c.
 * Returns { type, r1?, r2?, disc }
 *   type 'none'    — a === 0, not a quadratic
 *   type 'complex' — negative discriminant, no real roots
 *   type 'double'  — one repeated root (r1 === r2)
 *   type 'real'    — two distinct real roots
 */
export function getRoots(a, b, c) {
  const disc = b * b - 4 * a * c;
  if (a === 0) return { type: 'none', disc };
  if (disc < 0) return { type: 'complex', disc };
  if (disc === 0) {
    const r = -b / (2 * a);
    return { type: 'double', r1: r, r2: r, disc };
  }
  return {
    type: 'real',
    r1: (-b + Math.sqrt(disc)) / (2 * a),
    r2: (-b - Math.sqrt(disc)) / (2 * a),
    disc,
  };
}
