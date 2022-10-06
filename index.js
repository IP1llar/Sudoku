'use strict';
let array = [
  [8, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 6, 0, 0, 0, 0, 0],
  [0, 7, 0, 0, 9, 0, 2, 0, 0],
  [0, 5, 0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 4, 5, 7, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 3, 0],
  [0, 0, 1, 0, 0, 0, 0, 6, 8],
  [0, 0, 8, 5, 0, 0, 0, 1, 0],
  [0, 9, 0, 0, 0, 0, 4, 0, 0],
];

let board = [
  [8, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 3, 6, 0, 0, 0, 0, 0],
  [0, 7, 0, 0, 9, 0, 2, 0, 0],
  [0, 5, 0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 4, 5, 7, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 3, 0],
  [0, 0, 1, 0, 0, 0, 0, 6, 8],
  [0, 0, 8, 5, 0, 0, 0, 1, 0],
  [0, 9, 0, 0, 0, 0, 4, 0, 0],
];

let out = [];
let count = 0;
async function generateSolution(array, depth = 0) {
  for (let y = 0; y <= 9; y++) {
    for (let x = 0; x < 9; x++) {
      // if we reached depth = 9, we know we have got a good solution
      if (y === 9) {
        UpdateTable(array);
        await delay(10);
        return array;
      }
      if (array[y][x] === 0) {
        for (let i = 1; i <= 10; i++) {
          count++;
          if (i === 10) {
            // if we reach 10, it means we reached a bad solution and needs to backtrack(return)
            return 'No Viable Solutions';
          }
          if (count > 10000/depth) {
            let copyArr1 = JSON.parse(JSON.stringify(array));
              copyArr1[y][x] = i;
            UpdateTable(copyArr1);
            await delay(10);
            count = 0;
          }
          if (CheckPossible(array, y, x, i)) {
            //if we find a possible square, lets clone it and if we need to backtrack we can access
            //pre-modified board
            let copyArr = JSON.parse(JSON.stringify(array));
            copyArr[y][x] = i;
            let result = await generateSolution(copyArr, depth+1);
            //As we backtrack (going up the inception stack) we need to make sure it is
            //an actual valid result
            if (result !== 'No Viable Solutions') {
              return result;
            }
          }
        }
      }
    }
  }
}

function solveSudoku(board) {
  const n = board.length;
  dfs(board, n);
}

function dfs(board, n) {
    console.table(board)
  // for every cell in the sudoku
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      // if its empty
      if (board[row][col] !== '.') continue;
      // try every number 1-9
      for (let i = 1; i <= 9; i++) {
        const c = i.toString();
        // if that number is valid
        if (isValid(board, row, col, n, c)) {
          board[row][col] = c;
          // continue search for that board, ret true if solution is reached
          if (dfs(board, n)) return true;
        }
      }
      // solution wasnt found for any num 1-9 here, must be a dead end...
      // set the current cell back to empty
      board[row][col] = '.';
      // ret false to signal dead end
      return false;
    }
  }
  // all cells filled, must be a solution
  return true;
}



function findCells(array) {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (array[y][x] === 0) return [y, x];
    }
  }
  return undefined;
}

function CheckPossible(array, y, x, n) {
  for (let i = 0; i < array.length; i++) {
    if (array[y][i] === n) return false;
  }

  for (let i = 0; i < array.length; i++) {
    if (array[i][x] === n) return false;
  }

  let quadrantX = x / 3;
  let quadrantY = y / 3;

  if (quadrantX < 1) {
    quadrantX = 0;
  } else if (quadrantX < 2) {
    quadrantX = 3;
  } else {
    quadrantX = 6;
  }

  if (quadrantY < 1) {
    quadrantY = 0;
  } else if (quadrantY < 2) {
    quadrantY = 3;
  } else {
    quadrantY = 6;
  }

  for (let row = quadrantY; row < quadrantY + 3; row++) {
    for (let col = quadrantX; col < quadrantX + 3; col++) {
      if (array[row][col] === n) return false;
    }
  }
  return true;
}


//first we need a data structure
//then will create a new sydoky table
function CreateTable(array){
  let $table = $('.sudoku');
  $table.empty();
  for (let x = 0; x < 9; x++){
    let $TableRow = $(`<tr class="${x} row"></tr>`)
    $table.append($TableRow)
    for(let y = 0;y<9;y++){
      let $tableData = $(`<td class="${y} number">0</td>`)
      $TableRow.append($tableData);
    }
  }
  for (let i = 0; i<array.length; i++) {
    for (let j=0; j<array.length; j++) {
      let $tableData = $(`tr.${i} td.${j}`);
      $tableData.text(array[i][j]);
    }
  }
    
}

function UpdateCell(array, i, j) {
  let $tableData = $(`tr.${i} td.${j}`);
  $tableData.text(array[i][j]);
}
function UpdateTable(array) {
  for (let i = 0; i<array.length; i++) {
    for (let j=0; j<array.length; j++) {
      let $tableData = $(`tr.${i} td.${j}`);
      $tableData.text(array[i][j]);
    }
  }
}

let interval;
$("document").ready(function () {
  $('.newSudoku').click(async function (){

    // clearInterval(interval)
    //create a new table
    CreateTable(array)
    // await delay(10);
    // generateSolution(array);
//   let count = 0;
//     interval = setInterval(()=>{
//       let $data = $('tr.1 td.1');
//       $data.text(count);
//       count++;
//     }, 1000);
})


$('.solve').click(async function(){
    // await delay(1000)
    console.log(await generateSolution(JSON.parse(JSON.stringify(array))))
    console.log(array);
})
})



async function delay (time) {
  await new Promise(res=>setTimeout(res, time));
}


// console.table(generateSolution(array))