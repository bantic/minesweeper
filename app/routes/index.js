import Ember from 'ember';
import Board from '../models/board';

function createBoard() {
  return Board.create({
    mines: 5,
    rows: 16,
    cols: 16
  });
}

export default Ember.Route.extend({
  model() {
    return createBoard();
  }
});
