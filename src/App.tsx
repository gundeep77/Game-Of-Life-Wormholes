import { useCallback, useEffect, useRef, useState } from "react";
import {
  COLS,
  DIRECTIONS,
  ROWS,
  generateSingleWormhole,
  initBoard,
} from "./constants";
import { twMerge } from "tailwind-merge";
import { PlayPauseButton } from "./components/PlayPauseButton";
import { OperationalButton } from "./components/OperationalButton";
import { SpeedSelect } from "./components/SpeedSelect";
import html2canvas from "html2canvas";
// import Starfield from "react-starfield";

function App() {
  const newBoard = initBoard();
  const [board, setBoard] = useState<number[][]>(newBoard);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(100);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [wormholeMap, setWormholeMap] = useState<Map<string, [number, number]>>(
    new Map()
  );
  const [wormholes, setWormholes] = useState<
    [
      [number | undefined, number | undefined],
      [number | undefined, number | undefined]
    ]
  >([
    [undefined, undefined],
    [undefined, undefined],
  ]);

  const runningRef = useRef(isGameRunning);
  runningRef.current = isGameRunning;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const wormholesRef = useRef(wormholeMap);
  wormholesRef.current = wormholeMap;

  const gridRef = useRef<HTMLDivElement>(null);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((everyRow) => [...everyRow]);

      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          let livingNeighbors = 0;
          DIRECTIONS.forEach((direction) => {
            const neighborX = i + direction[0];
            const neighborY = j + direction[1];

            if (
              neighborX >= 0 &&
              neighborX < ROWS &&
              neighborY >= 0 &&
              neighborY < COLS
            ) {
              if (prevBoard[neighborX][neighborY] === 1) {
                livingNeighbors += 1;
              }
            }
          });
          if (livingNeighbors < 2 || livingNeighbors > 3) {
            newBoard[i][j] = 0;
          } else if (prevBoard[i][j] === 0 && livingNeighbors === 3) {
            newBoard[i][j] = 1;
          }
        }
      }
      return newBoard;
    });

    setTimeout(runSimulation, speedRef.current);
  }, [setBoard]);

  const handlePlayPause = () => {
    if (!isGameRunning) {
      runningRef.current = true;
      runSimulation();
    }
    setIsGameRunning(!isGameRunning);
  };

  const handleFill = () => {
    const filledRows = [];

    for (let i = 0; i < ROWS; i++) {
      const row = Array.from({ length: COLS }, (_, j) => {
        const isWormhole =
          wormholes[0][0] !== undefined &&
          wormholes[0][1] !== undefined &&
          wormholes[1][0] !== undefined &&
          wormholes[1][1] !== undefined;

        if (isWormhole && board[i][j] === 2) {
          return 2;
        }

        return Math.random() < 0.25 ? 1 : 0;
      });

      filledRows.push(row);
    }

    setBoard(filledRows);
  };

  const handleReset = () => {
    setBoard(initBoard());
    setIsGameRunning(false);
    setWormholeMap(new Map());
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeed(parseInt(e.target.value));
  };

  const handleCellClick = (row: number, col: number): void => {
    const newBoard = board.map((everyRow) => [...everyRow]);
    if (board[row][col] === 0) {
      newBoard[row][col] = 1;
    } else if (board[row][col] === 1) {
      newBoard[row][col] = 0;
    }
    setBoard(newBoard);
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseEnter = (i: number, j: number) => {
    if (isMouseDown) {
      handleCellClick(i, j);
    }
  };

  const handleGenerateWormholes = () => {
    const newBoard = board.map((everyRow) => [...everyRow]);
    const wormholeMap = generateSingleWormhole(newBoard);

    wormholesRef.current = wormholeMap[0];
    setWormholeMap(new Map(wormholeMap[0]));
    setWormholes([wormholeMap[1], wormholeMap[2]]);
    setBoard(wormholeMap[3]);
  };

  const handleDownloadPattern = async () => {
    const el = gridRef.current;
    if (!el) return;

    el.classList.add("print-safe");

    const canvas = await html2canvas(el);

    el.classList.remove("print-safe");

    const link = document.createElement("a");
    link.download = `game-of-life-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const getBoardSize = () => {
    const size = Math.min(
      (window.innerHeight - 200) / ROWS,
      (window.innerWidth - 16) / COLS,
      20
    );
    return size;
  };

  const [cellSize, setCellSize] = useState(getBoardSize());

  useEffect(() => {
    const handleResize = () => {
      setCellSize(getBoardSize());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    // <>
    //   <div className="z-0">
    //     <Starfield
    //       starCount={4000}
    //       starColor={[255, 255, 255]}
    //     />
    //   </div>
    <div className="min-h-screen w-full flex items-center p-4 flex-col gap-4 bg-gradient-to-b from-black to-green-600">
      <h1 className="md:text-2xl text-xl mt-2 font-mono font-bold">
        Conway's Game of Life
      </h1>
      <div className="flex gap-8 items-center">
        <div className="flex items-center mt-4 pb-2">
          <PlayPauseButton
            onClick={handlePlayPause}
            isGameRunning={isGameRunning}
          />
        </div>
        <div className="flex items-center mt-4 pb-2">
          <OperationalButton onClick={handleFill}>Fill</OperationalButton>
        </div>
        <div className="flex items-center mt-4 pb-2">
          <OperationalButton onClick={handleReset}>Reset</OperationalButton>
        </div>
        <div className="flex items-center mt-4 pb-2">
          <OperationalButton onClick={handleGenerateWormholes}>
            Generate Wormholes
          </OperationalButton>
        </div>
        <div className="flex items-center mt-4 pb-2">
          <SpeedSelect speed={speed} onChange={handleSpeedChange} />
        </div>
        <div className="flex items-center mt-4 pb-2">
          <OperationalButton onClick={handleDownloadPattern}>
            Download Pattern
          </OperationalButton>
        </div>
      </div>
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
          border: "2px solid",
          padding: "4px",
          zIndex: 10,
          marginTop: "15px",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((_col, colIndex) => (
            <button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              key={`${rowIndex}-${colIndex}`}
              className={twMerge(
                "border border-green-700",
                board[rowIndex][colIndex] === 1
                  ? "bg-white"
                  : board[rowIndex][colIndex] === 2
                  ? "bg-amber-500"
                  : "bg-black"
              )}
            ></button>
          ))
        )}
      </div>
    </div>
    // </>
  );
}

export default App;
