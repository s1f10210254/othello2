import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);

  const initialBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const [board, setBoard] = useState(initialBoard);

  const direction = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ];

  const resetBoard = () => {
    setBoard(initialBoard);
    setTurnColor(1);
  };

  const clickCell = (x: number, y: number) => {
    console.log(x, y);
    const newBoard = JSON.parse(JSON.stringify(board));

    function checkBoard(color: number) {
      //候補地を初期化
      for (let i = 0; i < 8; i += 1) {
        for (let j = 0; j < 8; j += 1) {
          if (newBoard[i][j] === 3) {
            newBoard[i][j] = 0;
          }
        }
      }
      //
      for (let i = 0; i < 8; i += 1) {
        for (let j = 0; j < 8; j += 1) {
          if (newBoard[i][j] === 0) {
            console.log(i, j);
            for (const t of direction) {
              let pass = false;
              console.log(t);
              //対象のセルからの距離をチェック
              for (let dis = 1; dis < 8; dis += 1) {
                //基準セルからの距離に対応する位置が盤面の範囲外になるかチェック
                if (newBoard[i + t[0] * dis] === undefined) {
                  break;
                } else if (newBoard[j + t[1] * dis] === undefined) {
                  break;
                  //基準セルからの距離に対応する位置に石が置枯れていないかチェック
                } else if (newBoard[i + t[0] * dis][j + t[1] * dis] % 3 === 0) {
                  break;
                  // 基準セルからの距離に対応する位置に同じ色がある場合PASS
                } else if (newBoard[i + t[0] * dis][j + t[1] * dis] === color) {
                  pass = true;
                  //
                } else if (newBoard[i + t[0] * dis][j + t[1] * dis] === 3 - color) {
                  if (pass) {
                    newBoard[i][j] = 3;
                  }

                  break;
                }
              }
            }
          }
        }
      }
      setBoard(newBoard);
    }

    if (board[y][x] === 3) {
      let putStone = false;
      for (const s of direction) {
        let passWhite = false;
        for (let distance = 1; distance < 8; distance += 1) {
          if (board[y + s[0] * distance] === undefined) {
            break;
          } else if (board[y + s[0] * distance][x + s[1] * distance] === (0 || 3)) {
            break;
          } else if (board[y + s[0] * distance][x + s[1] * distance] === 3 - turnColor) {
            passWhite = true;
          } else if (board[y + s[0] * distance][x + s[1] * distance] === turnColor) {
            for (let i = distance; i >= 0; i -= 1) {
              if (passWhite) {
                putStone = true;
                newBoard[y + s[0] * i][x + s[1] * i] = turnColor;
              }
            }
            break;
          }
        }
      }
      if (putStone) {
        setBoard(newBoard);
        checkBoard(turnColor);
        setTurnColor(3 - turnColor);
      }
    }
    if (newBoard.some((row: number[]) => row.includes(3)) === false) {
      checkBoard(3 - turnColor);
      setTurnColor(turnColor);
      alert(
        `石を置ける場所がないため${3 - turnColor === 1 ? '黒' : '白'}のターンがスキップされます`
      );
    }
  };

  let blackStones = 0;
  let whiteStones = 0;

  // `board`の要素をループして、`color`の値に応じて`blackStones`と`whiteStones`をカウントします
  board.forEach((row) => {
    row.forEach((color) => {
      if (color === 1) {
        blackStones++;
      } else if (color === 2) {
        whiteStones++;
      }
    });
  });

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} onClick={() => clickCell(x, y)} key={`${x}-${y}`}>
              {color !== 0 && color !== 3 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}

              {color === 3 && <div className={styles.inditate} />}
            </div>
          ))
        )}
      </div>
      <div className={styles['side-panel']}>
        <div className={styles.turn}>
          <h1>{turnColor === 1 ? '黒' : '白'}の番です</h1>
        </div>
        <div className={styles.score}>
          <h2>＜得点＞</h2>
          <h2>黒: {blackStones}</h2>
          <h2>白: {whiteStones}</h2>
        </div>
        {/* リセットボタン */}
        <button className={styles.button} onClick={resetBoard}>
          リセット
        </button>
      </div>
    </div>
  );
};

export default Home;
