'use client';

import { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null); // 'X', 'O', or 'DRAW'

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(sq => sq) ? 'DRAW' : null;
  };

  const aiMove = (squares) => {
    // Simple AI: 1. Win if can, 2. Block if must, 3. Random empty
    const emptyIndices = squares.map((v, i) => v === null ? i : null).filter(v => v !== null);

    if (emptyIndices.length === 0) return;

    // TODO: Smarter logic later. For now, random to give kid a chance!
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    const nextSquares = [...squares];
    nextSquares[randomIndex] = 'O';
    setBoard(nextSquares);

    const gameWinner = checkWinner(nextSquares);
    if (gameWinner) setWinner(gameWinner);
    else setIsPlayerTurn(true);
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        aiMove(board);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner]);

  const handleClick = (i) => {
    if (board[i] || winner || !isPlayerTurn) return;

    const nextSquares = [...board];
    nextSquares[i] = 'X';
    setBoard(nextSquares);

    const gameWinner = checkWinner(nextSquares);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-xs mb-8">
        <div className={`flex items-center space-x-2 ${isPlayerTurn && !winner ? 'text-primary' : 'text-muted-foreground'}`}>
          <Terminal className="w-5 h-5" />
          <span className="font-mono font-bold">YOU (X)</span>
        </div>
        <div className="text-secondary font-mono text-xs">VS</div>
        <div className={`flex items-center space-x-2 ${!isPlayerTurn && !winner ? 'text-destructive' : 'text-muted-foreground'}`}>
          <span className="font-mono font-bold">SYSTEM (O)</span>
          <Cpu className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-muted/20 p-2 rounded-lg border border-border">
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`
                    w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-4xl font-bold font-mono rounded transition-colors
                    ${val === 'X' ? 'text-primary bg-primary/10' : ''}
                    ${val === 'O' ? 'text-destructive bg-destructive/10' : ''}
                    ${!val && !winner ? 'hover:bg-muted/40 cursor-pointer' : ''}
                `}
          >
            {val}
          </button>
        ))}
      </div>

      {winner && (
        <div className="mt-8 text-center animate-in zoom-in">
          {winner === 'X' && <h3 className="text-2xl font-bold text-primary mb-2">TARGET NEUTRALIZED!</h3>}
          {winner === 'O' && <h3 className="text-2xl font-bold text-destructive mb-2">SYSTEM BREACH DETECTED</h3>}
          {winner === 'DRAW' && <h3 className="text-2xl font-bold text-muted-foreground mb-2">STALEMATE</h3>}

          <button onClick={resetGame} className="mt-4 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 px-6 py-2 rounded font-mono uppercase">
            REBOOT SYSTEM
          </button>
        </div>
      )}
    </div>
  );
}
