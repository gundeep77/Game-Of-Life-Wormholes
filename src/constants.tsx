export const ROWS = 25;
export const COLS = 45;

export const initBoard = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};

export const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [-1, 0],
  [0, -1],
  [-1, -1],
  [-1, 1],
  [1, -1],
];

export const generateSingleWormhole = (
  board: number[][],
  minManhattanDistance = 2
): [
  Map<string, [number, number]>,
  [number, number] | [undefined, undefined],
  [number, number] | [undefined, undefined],
  number[][]
] => {
  const height = board.length;
  const width = board[0].length;

  const key = ([x, y]: [number, number]) => `${x},${y}`;
  const validCells: [number, number][] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (board[y][x] === 0) {
        validCells.push([y, x]);
      }
    }
  }

  if (validCells.length < 2) {
    console.warn("Not enough dead cells to place wormholes!");
    return [new Map(), [undefined, undefined], [undefined, undefined], board];
  }

  let p1: [number, number], p2: [number, number];

  while (true) {
    p1 = validCells[Math.floor(Math.random() * validCells.length)];
    p2 = validCells[Math.floor(Math.random() * validCells.length)];

    const manhattan = Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);

    if (key(p1) !== key(p2) && manhattan >= minManhattanDistance) break;
  }

  board[p1[0]][p1[1]] = 2;
  board[p2[0]][p2[1]] = 2;
  const map = new Map<string, [number, number]>();
  map.set(key(p1), p2);
  map.set(key(p2), p1);
  return [map, [p1[0], p1[1]], [p2[0], p2[1]], board];
};
