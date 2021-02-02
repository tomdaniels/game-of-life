import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';

import './game-of-life.css';

const numRows = 55;
const numCols = 100;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const Gol = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      // step through every cell
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              // compute the new cells
              const newI = i + x;
              const newK = k + y;

              // don't go out of bounds
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            // handle dead cells
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
              // handle regen.
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 15);
  }, []);

  const start = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
      runSimulation();
    }
  };

  const setRandom = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(
        Array.from(Array(numCols), () => (Math.random() > 0.95 ? 1 : 0))
      );
    }

    setGrid(rows);
  };

  const clearGrid = () => {
    setGrid(generateEmptyGrid());
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? 'teal' : undefined,
                border: 'solid 1px black'
              }}
            />
          ))
        )}
      </div>
      <div className='gol-button-group'>
          <button onClick={start}>{running ? 'stop' : 'start'}</button>
          <button onClick={setRandom}>random</button>
          <button onClick={clearGrid}>clear</button>
        </div>
    </>
  );
};

export default Gol;