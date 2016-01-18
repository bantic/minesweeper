import Ember from 'ember';
import Cell from './cell';

const { computed } = Ember;

function getRandomInt(max) {
  let min = 0;
  return Math.floor(Math.random() * (max - min)) + min;
}

export default Ember.Object.extend({
  mines:  0,
  rows:  0,
  cols: 0,
  cells: computed(function() { return [[]]; }),

  addCell(cell,row,col) {
    let cells = this.get('cells');
    if (!cells[row]) { cells[row] = []; }
    cell.set('board', this);
    cell.set('row',row);
    cell.set('col',col);
    cells[row][col] = cell;
  },

  getCell(row, col) {
    let cells = this.get('cells');
    return cells[row][col];
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
      neighbor.open();
      if (neighbor.get('isEmpty')) {
        queue.push(...this.neighborsFor(neighbor));
      }
    }
  },

  openImmediateSurrounding(cell) {
    let neighbors = this.neighborsFor(cell);
    neighbors.filterBy('isFlagged', false).forEach(neighbor => {
      neighbor.open();
      if (neighbor.get('isEmpty')) {
        this.openEmptySurrounding(neighbor);
      }
    });
  },

  neighborsFor(cell) {
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

    let mineOptions = [];
    let mineSpots = [];
    for (let i=0; i < rows*cols; i++) {
      mineOptions.push(i);
    }
    for (let i=0; i < mines; i++) {
      let mineSpot = getRandomInt(mineOptions.length);
      mineSpots.push(mineSpot);
      mineOptions.splice(mineSpot, 1);
    }

    for (let i=0; i < rows; i++) {
      for (let j=0; j < cols; j++) {
        this.addCell(Cell.create(), i, j);
      }
    }

    for (let i=0; i<mineSpots.length; i++) {
      let mineSpot = mineSpots[i];
      let row = Math.floor(mineSpot / rows),
          col = mineSpot % rows;
      let cell = this.getCell(row, col);
      cell.set('hasMine', true);
    }
  }
});
