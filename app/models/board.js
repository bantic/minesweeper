import Ember from 'ember';
import Cell from './cell';

function getRandomInt(max) {
  let min = 0;
  return Math.floor(Math.random() * (max - min)) + min;
}

export default Ember.Object.extend({
  mines:  0,
  rows:  0,
  cols: 0,
  isLost: false,
  isWon: false,
  cells: null,

  getCell(row, col) {
    let cells = this.get('cells');
    return cells[row][col];
  },

  open(cell, options={}) {
    if (cell.get('isOpen')) {
      return;
    }
    cell.set('isOpen', true);

    if (cell.get('hasMine')) {
      this.set('isLost', true);
    } else if (this.checkIfWon()) {
      this.set('isWon', true);
    } else if (options.openEmptySurrounding) {
      this.openEmptySurrounding(cell);
    }
  },

  checkIfWon() {
    let { rows, cols } = this.getProperties('rows', 'cols');
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let cell = this.getCell(r, c);
        if (cell.get('hasMine') || cell.get('isOpen')) {
          //
        } else {
          return false;
        }
      }
    }
    return true;
  },

  openEmptySurrounding(cell) {
    let queue = this.neighborsFor(cell);
    let seen = {};
    while (queue.length) {
      let neighbor = queue.shift();
      if (seen[Ember.guidFor(neighbor)]) {
        continue;
      }
      seen[Ember.guidFor(neighbor)] = true;
      this.open(neighbor);
      if (neighbor.get('isEmpty')) {
        queue.push(...this.neighborsFor(neighbor));
      }
    }
  },

  openImmediateSurrounding(cell) {
    console.log('openImmediateSurrounding');
    if (!cell.get('isSurroundFlagged')) {
      return false;
    }

    let neighbors = this.neighborsFor(cell);
    neighbors.filterBy('isFlagged', false).forEach(neighbor => {
      this.open(neighbor);
      if (neighbor.get('isEmpty')) {
        this.openEmptySurrounding(neighbor);
      }
    });

    return true;
  },

  neighborsFor(cell) {
    console.log('neighborsFor');
    let rows = this.get('rows'),
        cols = this.get('cols');

    let row = cell.get('row'),
        col = cell.get('col');
    return Ember.A([
      row > 0 && this.getCell(row-1,col),
      row > 0 && col > 0 && this.getCell(row-1,col-1),
      row > 0 && col < cols -1 && this.getCell(row-1,col+1),
      col > 0 && this.getCell(row, col-1),
      col < cols - 1 && this.getCell(row, col+1),
      row < rows - 1 && col > 0 && this.getCell(row+1, col-1),
      row < rows - 1 && this.getCell(row+1, col),
      row < rows - 1 && col < cols - 1 && this.getCell(row+1, col+1)
    ]).filter(n => !!n);
  },

  init: function() {
    this._super(...arguments);

    let {mines, rows, cols} = this.getProperties(['mines','rows','cols']);
    this.set('cells', this._createCells(rows, cols));
    this._addMines(mines, rows, cols);
  },

  _addMines(mineCount, rows, cols) {
    let mineOptions = [], mineSpots = [];

    for (let i=0; i < rows*cols; i++) {
      mineOptions.push(i);
    }

    for (let i=0; i < mineCount; i++) {
      let mineSpot = getRandomInt(mineOptions.length);
      mineSpots.push(mineSpot);
      mineOptions.splice(mineSpot, 1);
    }

    for (let i=0; i<mineSpots.length; i++) {
      let mineSpot = mineSpots[i];
      let row = Math.floor(mineSpot / rows),
          col = mineSpot % rows;

      this.getCell(row, col).set('hasMine', true);
    }
  },

  _createCells(rows, cols) {
    let cells = [];

    for (let row=0; row < rows; row++) {
      if (!cells[row]) {
        cells[row] = [];
      }
      for (let col=0; col < cols; col++) {
        let cell = Cell.create({row, col, board: this});
        cells[row][col] = cell;
      }
    }

    return cells;
  }
});
